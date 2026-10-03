import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Check, ChevronRight, CircleCheck, Clock3, ShieldCheck, Sparkles, Star } from 'lucide-react'
import type { TransactionStatus, Vendor } from '../types'

export function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="brand" aria-label="PACT AI Commerce Agent"><span className="brand-mark">P</span>{!compact && <span><strong>PACT</strong><small>AI Commerce Agent</small></span>}</div>
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { tone?: 'primary' | 'secondary' | 'paypal' | 'quiet'; children: ReactNode }
export function Button({ tone = 'primary', className = '', children, ...props }: ButtonProps) {
  return <button className={`button button-${tone} ${className}`} {...props}>{children}</button>
}

export function SandboxBadge({ compact = false }: { compact?: boolean }) {
  return <span className="sandbox-badge"><span className="sandbox-dot" />{compact ? 'Sandbox' : 'Sandbox Mode'}</span>
}

export function StatusBadge({ status }: { status: TransactionStatus | 'Verified' | 'Best match' }) {
  const className = status.toLowerCase().replaceAll(' ', '-')
  return <span className={`status-badge status-${className}`}>{status === 'Completed' || status === 'Verified' || status === 'Best match' ? <CircleCheck size={13} /> : <Clock3 size={13} />}{status}</span>
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <header className="page-header"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1><p>{description}</p></div>{action && <div className="page-header-action">{action}</div>}</header>
}

const flowSteps = ['Describe Goal', 'Agent Plans', 'Review & Approve', 'PayPal Payment', 'Goal Completed']
export function TransactionStepper({ current }: { current: number }) {
  return <div className="transaction-stepper" aria-label="Transaction progress">{flowSteps.map((label, index) => <div className="step-wrap" key={label}><div className={`step ${index + 1 < current ? 'done' : index + 1 === current ? 'active' : ''}`}><span>{index + 1 < current ? <Check size={13} /> : index + 1}</span><b>{label}</b></div>{index < flowSteps.length - 1 && <i className={index + 1 < current ? 'done' : ''} />}</div>)}</div>
}

export function MetricCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon?: ReactNode }) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span>{icon}</div><strong>{value}</strong><small>{detail}</small></div>
}

export function VendorMark({ vendor, large = false }: { vendor: Vendor; large?: boolean }) {
  return <span className={`vendor-mark ${large ? 'vendor-mark-lg' : ''}`} style={{ background: vendor.accent }}>{vendor.name.slice(0, 2).toUpperCase()}</span>
}

export function Rating({ value, reviews }: { value: number; reviews?: number }) {
  return <span className="rating"><Star size={14} fill="currentColor" />{value.toFixed(1)}{reviews !== undefined && <em>({reviews.toLocaleString()})</em>}</span>
}

export function Toggle({ enabled, onChange, label, note }: { enabled: boolean; onChange: () => void; label: string; note?: string }) {
  return <div className="toggle-row"><div><strong>{label}</strong>{note && <span>{note}</span>}</div><button className={`toggle ${enabled ? 'on' : ''}`} onClick={onChange} aria-pressed={enabled} aria-label={`Toggle ${label}`}><i /></button></div>
}

export function Tabs({ items, active, onChange }: { items: string[]; active: string; onChange: (item: string) => void }) {
  return <div className="tabs" role="tablist">{items.map((item) => <button role="tab" aria-selected={active === item} className={active === item ? 'active' : ''} key={item} onClick={() => onChange(item)}>{item}</button>)}</div>
}

export function TrustNote({ children = 'PACT prepares the transaction. You authorize the payment.' }: { children?: ReactNode }) {
  return <div className="trust-note"><ShieldCheck size={17} /><span>{children}</span></div>
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="empty-state"><Sparkles size={24} /><strong>{title}</strong><span>{text}</span>{action}</div>
}

export function ArrowAction({ children }: { children: ReactNode }) { return <span className="arrow-action">{children}<ChevronRight size={15} /></span> }
