import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import type { ToastNotification } from '../../types'

export function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastNotification
  onDismiss: (id: string) => void
}) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={16} className="toast-icon toast-icon-success" />
      case 'error':
        return <AlertCircle size={16} className="toast-icon toast-icon-error" />
      case 'warning':
        return <AlertTriangle size={16} className="toast-icon toast-icon-warning" />
      default:
        return <Info size={16} className="toast-icon toast-icon-info" />
    }
  }

  return (
    <div className={`toast-item toast-${toast.type || 'info'}`} role="alert">
      {getIcon()}
      <div className="toast-message">{toast.message}</div>
      <button
        type="button"
        className="toast-dismiss-btn"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastNotification[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
