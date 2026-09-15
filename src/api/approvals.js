import { api } from './client'

export const listApprovals = () => api.get('/approvals')
export const approve = (approvalId) => api.post(`/approvals/${approvalId}/approve`, {})
export const reject = (approvalId, reason) => api.post(`/approvals/${approvalId}/reject`, { reason })
