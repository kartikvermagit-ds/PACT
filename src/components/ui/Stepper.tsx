import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface StepItem {
  id: number
  label: string
  path: string
}

const transactionSteps: StepItem[] = [
  { id: 1, label: 'Describe Goal', path: '/new' },
  { id: 2, label: 'Agent Plans', path: '/plan' },
  { id: 3, label: 'Review & Approve', path: '/review' },
  { id: 4, label: 'PayPal Payment', path: '/payment' },
  { id: 5, label: 'Goal Completed', path: '/completed' },
]

export function TransactionStepper({
  current,
  allowNav = true,
}: {
  current: number
  allowNav?: boolean
}) {
  const navigate = useNavigate()

  const handleStepClick = (step: StepItem) => {
    // Only allow navigating back to completed steps or current step if enabled
    if (allowNav && step.id <= current) {
      navigate(step.path)
    }
  }

  return (
    <nav className="transaction-stepper" aria-label="Transaction progress">
      {transactionSteps.map((step, index) => {
        const isDone = step.id < current
        const isActive = step.id === current
        const isClickable = allowNav && step.id <= current

        return (
          <div className="step-wrap" key={step.id}>
            <button
              type="button"
              className={`step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isClickable ? 'clickable' : ''}`}
              onClick={() => handleStepClick(step)}
              disabled={!isClickable}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="step-indicator">
                {isDone ? <Check size={12} strokeWidth={3} /> : step.id}
              </span>
              <b className="step-label">{step.label}</b>
            </button>
            {index < transactionSteps.length - 1 && (
              <div className={`step-connector ${isDone ? 'done' : ''}`} aria-hidden="true" />
            )}
          </div>
        )
      })}
    </nav>
  )
}
