import type { ReactNode } from 'react'
import { AlertCircle, Check, CircleCheck, Clock3, Sparkles } from 'lucide-react'
import type { TransactionStatus } from '../../types'

export function SandboxBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`sandbox-badge ${compact ? 'sandbox-badge-compact' : ''}`}>
      <span className="sandbox-dot" />
      {compact ? 'Sandbox' : 'Sandbox Mode'}
    </span>
  )
}

export type StatusType = TransactionStatus | 'Verified' | 'Best match' | 'Active' | 'Review'

export function StatusBadge({ status }: { status: StatusType }) {
  const className = status.toLowerCase().replaceAll(' ', '-')

  const getIcon = () => {
    switch (status) {
      case 'Completed':
      case 'Verified':
        return <CircleCheck size={13} />
      case 'Best match':
        return <Sparkles size={13} />
      case 'Failed':
        return <AlertCircle size={13} />
      default:
        return <Clock3 size={13} />
    }
  }

  return (
    <span className={`status-badge status-${className}`}>
      {getIcon()}
      {status}
    </span>
  )
}

export function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: 'orange' | 'green' | 'blue' | 'neutral' | 'red'
  children: ReactNode
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function VerifiedPill() {
  return (
    <span className="verified-mini">
      <Check size={12} /> Verified vendor
    </span>
  )
}
