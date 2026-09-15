import { api } from './client'

export const submitQuotation = (payload) => api.post('/quotations', payload)
export const listRfqQuotations = (rfqId) => api.get(`/rfqs/${rfqId}/quotations`)
export const getQuotation = (quotationId) => api.get(`/quotations/${quotationId}`)
export const reviseQuotation = (quotationId, payload) => api.post(`/quotations/${quotationId}/revise`, payload)
