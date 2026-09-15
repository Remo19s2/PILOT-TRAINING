import { api } from './client'

export const createRfq = (payload) => api.post('/rfqs', payload)
export const listRfqs = () => api.get('/rfqs')
export const getRfq = (rfqId) => api.get(`/rfqs/${rfqId}`)
export const sendRfq = (rfqId, supplierIds) => api.post(`/rfqs/${rfqId}/send`, { supplier_ids: supplierIds })
export const getRfqResponses = (rfqId) => api.get(`/rfqs/${rfqId}/responses`)
export const selectSupplier = (rfqId, quotationId) => api.post(`/rfqs/${rfqId}/select`, { quotation_id: quotationId })
