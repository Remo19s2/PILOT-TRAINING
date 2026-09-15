import { api } from './client'

export const getSupplierRisk = (supplierId) => api.get(`/suppliers/${supplierId}/risk`)
