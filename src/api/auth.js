import { api, clearSession } from './client'

export const login = async (username, password) => {
  const session = await api.post('/auth/login', { username, password })
  localStorage.setItem('mycelia_access_token', session.access_token)
  if (session.refresh_token) localStorage.setItem('mycelia_refresh_token', session.refresh_token)
  localStorage.setItem('prism_user', JSON.stringify(session.user))
  return session.user
}

export const me = () => api.get('/auth/me')
export const refresh = () => api.post('/auth/refresh', { refresh_token: localStorage.getItem('mycelia_refresh_token') })
export const logout = clearSession
