import { api } from './client'

export const listNegotiations = () => api.get('/negotiations')
export const draftNegotiation = (payload) => api.post('/negotiations/draft', payload)
export const authorizeNegotiation = (negotiationId, message) => api.post(`/negotiations/${negotiationId}/authorize`, { message })
export const postNegotiationMessage = (negotiationId, content) => api.post(`/negotiations/${negotiationId}/messages`, { content })
