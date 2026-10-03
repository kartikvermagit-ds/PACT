import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'primary' | 'secondary' | 'outline' | 'quiet' | 'ghost' | 'paypal' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  children: ReactNode
}

export function Button({
  tone = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const resolvedTone = tone === 'ghost' ? 'quiet' : tone
  const classes = [
    'button',
    `button-${resolvedTone}`,
    `button-${size}`,
    fullWidth ? 'button-full' : '',
    loading ? 'button-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          <span>Processing…</span>
        </>
      ) : (
        <>
          {iconLeft && <span className="button-icon-left">{iconLeft}</span>}
          <span>{children}</span>
          {iconRight && <span className="button-icon-right">{iconRight}</span>}
        </>
      )}
    </button>
  )
}
