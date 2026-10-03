import type { ReactNode } from 'react'
import { ChevronRight, ShieldCheck, Sparkles, Star } from 'lucide-react'
import type { Vendor } from '../types'

export { Button, type ButtonProps } from './ui/Button'
export { Badge, SandboxBadge, StatusBadge, VerifiedPill, type StatusType } from './ui/Badge'
export { Card, CardHeader, MetricCard, type CardProps } from './ui/Card'
export { TransactionStepper, type StepItem } from './ui/Stepper'
export {
  CheckboxField,
  InputField,
  SearchInput,
  SelectField,
  TextareaField,
  Toggle,
  type InputFieldProps,
  type SelectFieldProps,
  type TextareaFieldProps,
} from './ui/Form'
export { Modal, type ModalProps } from './ui/Modal'
export { ToastContainer, ToastItem } from './ui/Toast'

// Brand Logo Component
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="PACT AI Commerce Agent">
      <span className="brand-mark">P</span>
      {!compact && (
        <span className="brand-text">
          <strong>PACT</strong>
          <small>AI Commerce Agent</small>
        </span>
      )}
    </div>
  )
}

// Page Header
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </header>
  )
}

// Vendor Monogram Mark
export function VendorMark({ vendor, large = false }: { vendor: Vendor; large?: boolean }) {
  return (
    <span
      className={`vendor-mark ${large ? 'vendor-mark-lg' : ''}`}
      style={{ background: vendor.accent || '#ff6a00' }}
      aria-label={vendor.name}
    >
      {vendor.name.slice(0, 2).toUpperCase()}
    </span>
  )
}

// Rating display with star
export function Rating({ value, reviews }: { value: number; reviews?: number }) {
  return (
    <span className="rating">
      <Star size={14} fill="currentColor" />
      {value.toFixed(1)}
      {reviews !== undefined && <em>({reviews.toLocaleString()})</em>}
    </span>
  )
}

// Tab navigation
export function Tabs({
  items,
  active,
  onChange,
}: {
  items: string[]
  active: string
  onChange: (item: string) => void
}) {
  return (
    <div className="tabs" role="tablist">
      {items.map((item) => (
        <button
          key={item}
          role="tab"
          aria-selected={active === item}
          className={active === item ? 'active' : ''}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

// Trust note banner
export function TrustNote({
  children = 'PACT prepares the transaction. You authorize the payment.',
}: {
  children?: ReactNode
}) {
  return (
    <div className="trust-note">
      <ShieldCheck size={17} />
      <span>{children}</span>
    </div>
  )
}

// Empty state placeholder
export function EmptyState({
  title,
  text,
  action,
}: {
  title: string
  text: string
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <Sparkles size={24} />
      <strong>{title}</strong>
      <span>{text}</span>
      {action}
    </div>
  )
}

// Chevron action helper
export function ArrowAction({ children }: { children: ReactNode }) {
  return (
    <span className="arrow-action">
      {children}
      <ChevronRight size={15} />
    </span>
  )
}
