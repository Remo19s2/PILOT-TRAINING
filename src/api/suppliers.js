import { api } from './client'

export const listSuppliers = () => api.get('/suppliers')
export const getSupplier = (supplierId) => api.get(`/suppliers/${supplierId}`)
