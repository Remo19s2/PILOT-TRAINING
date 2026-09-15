import { api } from './client'

export const getDecision = (rfqId) => api.get(`/decisions/${rfqId}`)
export const runDecision = (rfqId) => api.post(`/decisions/${rfqId}/run`, {})
export const actOnDecision = (rfqId, payload) => api.post(`/decisions/${rfqId}/action`, payload)
