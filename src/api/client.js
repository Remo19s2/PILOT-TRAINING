const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '')
const REQUEST_TIMEOUT_MS = 15000

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export const getAccessToken = () => localStorage.getItem('mycelia_access_token')
export const getRefreshToken = () => localStorage.getItem('mycelia_refresh_token')

export const clearSession = () => {
  localStorage.removeItem('mycelia_access_token')
  localStorage.removeItem('mycelia_refresh_token')
  localStorage.removeItem('prism_user')
}

let isRefreshing = false
let refreshSubscribers = []

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token) => {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

async function performTokenRefresh() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token available')

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  })

  if (!response.ok) {
    clearSession()
    throw new Error('Refresh token invalid or expired')
  }

  const data = await response.json()
  if (data.access_token) {
    localStorage.setItem('mycelia_access_token', data.access_token)
  }
  if (data.refresh_token) {
    localStorage.setItem('mycelia_refresh_token', data.refresh_token)
  }
  if (data.user) {
    localStorage.setItem('prism_user', JSON.stringify(data.user))
  }
  return data.access_token
}

export async function request(path, options = {}, isRetry = false) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeout || REQUEST_TIMEOUT_MS)
  const token = getAccessToken()
  const headers = new Headers(options.headers || {})
  headers.set('Accept', 'application/json')
  if (options.body !== undefined) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
    })

    if (response.status === 401 && !isRetry && !path.includes('/auth/login') && !path.includes('/auth/refresh')) {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true
          try {
            const newToken = await performTokenRefresh()
            isRefreshing = false
            onRefreshed(newToken)
            return request(path, options, true)
          } catch (refreshError) {
            isRefreshing = false
            refreshSubscribers = []
            throw new ApiError('Session expired. Please log in again.', 401)
          }
        } else {
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh(() => {
              request(path, options, true).then(resolve).catch(reject)
            })
          })
        }
      }
    }

    const text = await response.text()
    const data = text ? JSON.parse(text) : null
    if (!response.ok) {
      const message = data?.detail || data?.message || `Request failed with status ${response.status}`
      throw new ApiError(message, response.status, data)
    }
    return data
  } catch (error) {
    if (error.name === 'AbortError') throw new ApiError('The request timed out. Please try again.', 408)
    if (error instanceof SyntaxError) throw new ApiError('The server returned an invalid response.', 502)
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
}
