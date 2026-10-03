import { createContext } from 'react'
import type { NotificationItem, Requirements, ToastNotification, ToastType, Vendor } from '../types'

export interface PrototypeState {
  selectedVendor: Vendor
  selectVendor: (vendor: Vendor) => void
  goal: string
  setGoal: (goal: string) => void
  parsedRequirements: Requirements
  setParsedRequirements: (req: Requirements) => void
  toast: string | null
  toasts: ToastNotification[]
  showToast: (message: string, type?: ToastType, duration?: number) => void
  dismissToast: (id: string) => void
  notifications: NotificationItem[]
  unreadNotificationsCount: number
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  isTemplateModalOpen: boolean
  setTemplateModalOpen: (open: boolean) => void
  applyTemplate: (templateId: string) => void
}

export const PrototypeStore = createContext<PrototypeState | null>(null)
