import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  elevated?: boolean
  interactive?: boolean
  className?: string
}

export function Card({ children, elevated = false, interactive = false, className = '', ...props }: CardProps) {
  const classes = [
    'pact-card',
    elevated ? 'pact-card-elevated' : '',
    interactive ? 'pact-card-interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  eyebrow,
  description,
  action,
  className = '',
}: {
  title?: ReactNode
  eyebrow?: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={`card-heading ${className}`}>
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {title && <h2>{title}</h2>}
        {description && <p className="card-subtitle">{description}</p>}
      </div>
      {action && <div className="card-action">{action}</div>}
    </div>
  )
}

export function MetricCard({
  label,
  value,
  detail,
  icon,
  trend,
  className = '',
}: {
  label: string
  value: string
  detail: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}) {
  return (
    <div className={`metric-card ${className}`}>
      <div className="metric-top">
        <span>{label}</span>
        {icon && <span className="metric-icon">{icon}</span>}
      </div>
      <strong className="metric-value">{value}</strong>
      <div className="metric-bottom">
        <small className={`metric-detail ${trend ? `trend-${trend}` : ''}`}>{detail}</small>
      </div>
    </div>
  )
}
