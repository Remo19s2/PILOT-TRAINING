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

export const clearSession = () => {
  localStorage.removeItem('mycelia_access_token')
  localStorage.removeItem('mycelia_refresh_token')
  localStorage.removeItem('prism_user')
}

export async function request(path, options = {}) {
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
