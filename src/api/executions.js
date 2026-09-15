import { api } from './client'

export const createWorkflowEvent = (payload) => api.post('/workflows/events', payload)
export const getWorkflowExecution = (executionId) => api.get(`/workflows/executions/${executionId}`)
