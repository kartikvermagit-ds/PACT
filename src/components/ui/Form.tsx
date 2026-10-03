import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'

// Input Field
export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
  action?: ReactNode
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, icon, action, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <div className="form-control-wrap">
          {icon && <span className="form-icon-left">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`form-input ${icon ? 'has-icon-left' : ''} ${action ? 'has-action-right' : ''}`}
            {...props}
          />
          {action && <span className="form-action-right">{action}</span>}
        </div>
        {error && <span className="form-error">{error}</span>}
        {!error && helperText && <span className="form-helper">{helperText}</span>}
      </div>
    )
  }
)
InputField.displayName = 'InputField'

// Textarea Field
export interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, helperText, className = '', id, rows = 3, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className="form-textarea"
          {...props}
        />
        {error && <span className="form-error">{error}</span>}
        {!error && helperText && <span className="form-helper">{helperText}</span>}
      </div>
    )
  }
)
TextareaField.displayName = 'TextareaField'

// Select Field
export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ value: string; label: string } | string>
  helperText?: string
}

export function SelectField({ label, options, helperText, className = '', id, ...props }: SelectFieldProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
        </label>
      )}
      <select id={selectId} className="form-select" {...props}>
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value
          const txt = typeof opt === 'string' ? opt : opt.label
          return (
            <option key={val} value={val}>
              {txt}
            </option>
          )
        })}
      </select>
      {helperText && <span className="form-helper">{helperText}</span>}
    </div>
  )
}

// Toggle Switch
export function Toggle({
  enabled,
  onChange,
  label,
  note,
  disabled = false,
}: {
  enabled: boolean
  onChange: () => void
  label: string
  note?: string
  disabled?: boolean
}) {
  return (
    <div className={`toggle-row ${disabled ? 'disabled' : ''}`}>
      <div>
        <strong>{label}</strong>
        {note && <span>{note}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        disabled={disabled}
        className={`toggle ${enabled ? 'on' : ''}`}
        onClick={onChange}
      >
        <i />
      </button>
    </div>
  )
}

// Search Input
export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={`search-input-wrap ${className}`}>
      <Search size={15} className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-control"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="search-clear-btn"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

// Checkbox Field
export function CheckboxField({
  checked,
  onChange,
  label,
  description,
  id,
  disabled = false,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  id?: string
  disabled?: boolean
}) {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`checkbox-field ${disabled ? 'disabled' : ''}`}>
      <label htmlFor={checkboxId} className="checkbox-label">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="checkbox-input"
        />
        <div className="checkbox-text">
          <strong>{label}</strong>
          {description && <span>{description}</span>}
        </div>
      </label>
    </div>
  )
}
