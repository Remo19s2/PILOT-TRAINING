import { api } from './client'

export const getRequirements = () => api.get('/planning/requirements')
export const getRequirement = (requirementId) => api.get(`/planning/requirements/${requirementId}`)
