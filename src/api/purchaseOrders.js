import { api } from './client'

export const listPurchaseOrders = () => api.get('/purchase-orders')
export const getPurchaseOrder = (poId) => api.get(`/purchase-orders/${poId}`)
export const createPurchaseOrder = (payload) => api.post('/purchase-orders', payload)
export const sendPurchaseOrder = (poId) => api.post(`/purchase-orders/${poId}/send`, {})
export const acknowledgePurchaseOrder = (poId, payload) => api.post(`/purchase-orders/${poId}/acknowledge`, payload)
