import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { coreGoal, goalTemplates, initialNotifications, requirements as defaultRequirements, vendors } from '../data/mockData'
import type { NotificationItem, Requirements, ToastNotification, ToastType, Vendor } from '../types'
import { PrototypeStore } from './prototypeStore'

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [selectedVendor, selectVendor] = useState<Vendor>(vendors[1]) // OfficeKart default
  const [goal, setGoal] = useState<string>(coreGoal)
  const [parsedRequirements, setParsedRequirements] = useState<Requirements>(defaultRequirements)
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false)

  // Backward-compatible single toast string
  const toast = toasts.length > 0 ? toasts[toasts.length - 1].message : null

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const newToast: ToastNotification = { id, message, type, duration }

    setToasts((prev) => [...prev.slice(-3), newToast])

    if (duration > 0) {
      window.setTimeout(() => {
        dismissToast(id)
      }, duration)
    }
  }, [dismissToast])

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const applyTemplate = useCallback((templateId: string) => {
    const template = goalTemplates.find((t) => t.id === templateId)
    if (!template) return

    setGoal(template.goal)
    setParsedRequirements({
      item: template.title,
      quantity: template.itemCount,
      budget: template.estimatedBudget,
      deadlineDays: template.deadlineDays,
      deliveryLocation: 'Office HQ, San Francisco',
      specialRequirements: `Template: ${template.category} package`,
    })
    setTemplateModalOpen(false)
    showToast(`Loaded template: ${template.title}`, 'success')
  }, [showToast])

  const value = useMemo(
    () => ({
      selectedVendor,
      selectVendor,
      goal,
      setGoal,
      parsedRequirements,
      setParsedRequirements,
      toast,
      toasts,
      showToast,
      dismissToast,
      notifications,
      unreadNotificationsCount,
      markNotificationRead,
      markAllNotificationsRead,
      isTemplateModalOpen,
      setTemplateModalOpen,
      applyTemplate,
    }),
    [
      selectedVendor,
      goal,
      parsedRequirements,
      toast,
      toasts,
      showToast,
      dismissToast,
      notifications,
      unreadNotificationsCount,
      markNotificationRead,
      markAllNotificationsRead,
      isTemplateModalOpen,
      applyTemplate,
    ]
  )

  return <PrototypeStore.Provider value={value}>{children}</PrototypeStore.Provider>
}
