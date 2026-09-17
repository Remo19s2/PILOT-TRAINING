import { api } from './client'

export const listNotifications = (unreadOnly = false) => api.get(`/notifications?unread_only=${unreadOnly}`)
export const markNotificationRead = (notificationId) => api.post(`/notifications/${notificationId}/read`, {})