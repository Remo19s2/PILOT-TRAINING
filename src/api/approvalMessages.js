import { api } from './client'

export const listApprovalMessages = (approvalId) => api.get(`/approvals/${approvalId}/messages`)
export const postApprovalMessage = (approvalId, content) => api.post(`/approvals/${approvalId}/messages`, { content })