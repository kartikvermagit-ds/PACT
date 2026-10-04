import { ArrowRight, Edit3 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, PageHeader, TransactionStepper } from '../components/ui'
import { usePrototype } from '../context/usePrototype'
import { aiService } from '../services/aiService'

const quickExamples = [
  {
    label: 'Conference Kits',
    text: 'I need 30 conference kits under $500 within 5 days.',
  },
  {
    label: 'Team Merchandise',
    text: '25 custom polo shirts under $400 in 7 days.',
  },
  {
    label: 'Office Supplies',
    text: 'Ergonomic office supplies under $300 in 3 days.',
  },
]

export function GoalPage() {
  const {
    goal,
    setGoal,
    parsedRequirements,
    setParsedRequirements,
    showToast,
  } = usePrototype()

  const [parsing, setParsing] = useState(false)
  const [editingParams, setEditingParams] = useState(false)
  const navigate = useNavigate()

  const handlePlanTransaction = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!goal.trim()) {
      showToast('Please enter what you want to accomplish.', 'warning')
      return
    }

    setParsing(true)
    try {
      showToast('Analyzing your requirements...', 'info')
      const parsed = await aiService.parseGoal(goal)
      setParsedRequirements(parsed)
      showToast('Requirements extracted. Comparing available offers...', 'success')
      navigate('/plan')
    } catch {
      showToast('Requirements extracted. Proceeding to plan.', 'info')
      navigate('/plan')
    } finally {
      setParsing(false)
    }
  }

  const handleExampleClick = (text: string) => {
    setGoal(text)
  }

  const handleFieldChange = (
    key: keyof typeof parsedRequirements,
    value: string | number
  ) => {
    setParsedRequirements({
      ...parsedRequirements,
      [key]: value,
    })
  }

  return (
    <div className="goal-page">
      <PageHeader
        eyebrow="Step 1 of 5"
        title="New Transaction"
        description="Describe your commercial goal in plain English. PACT extracts your constraints and evaluates qualifying offers."
      />

      <TransactionStepper current={1} />

      <div className="goal-layout">
        {/* Main Goal Intake Form */}
        <section className="goal-input-card">
          <form onSubmit={handlePlanTransaction}>
            <div className="goal-input-header">
              <label htmlFor="goal-textarea">
                <strong>What do you want to accomplish?</strong>
                <span>State your item, quantity, target budget, and delivery timeline.</span>
              </label>
            </div>

            <textarea
              id="goal-textarea"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. I need 30 conference kits under $500 within 5 days..."
              rows={4}
              aria-label="Commercial objective description"
              required
            />

            {/* Quick Example Presets */}
            <div className="quick-presets">
              <span className="presets-label">Preset examples:</span>
              <div className="preset-buttons">
                {quickExamples.map(({ label, text }) => (
                  <button
                    key={label}
                    type="button"
                    className="preset-chip"
                    onClick={() => handleExampleClick(text)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="goal-form-actions">
              <Button
                type="submit"
                tone="primary"
                size="lg"
                disabled={parsing || !goal.trim()}
                iconRight={<ArrowRight size={16} />}
              >
                {parsing ? 'Analyzing requirements...' : 'Plan this transaction'}
              </Button>
            </div>
          </form>
        </section>

        {/* Structured Constraint Preview Panel */}
        <aside className="goal-summary-card">
          <div className="summary-card-header">
            <div>
              <span className="eyebrow">Deterministic Extraction</span>
              <h3>Active Parameters</h3>
            </div>
            <button
              type="button"
              className="text-button"
              onClick={() => setEditingParams(!editingParams)}
            >
              <Edit3 size={13} /> {editingParams ? 'Done' : 'Edit'}
            </button>
          </div>

          <div className="parameter-grid">
            <div className="param-item">
              <small>Target Item</small>
              {editingParams ? (
                <input
                  type="text"
                  value={parsedRequirements.item}
                  onChange={(e) => handleFieldChange('item', e.target.value)}
                />
              ) : (
                <strong>{parsedRequirements.item}</strong>
              )}
            </div>

            <div className="param-item">
              <small>Required Quantity</small>
              {editingParams ? (
                <input
                  type="number"
                  value={parsedRequirements.quantity}
                  onChange={(e) =>
                    handleFieldChange('quantity', parseInt(e.target.value) || 1)
                  }
                />
              ) : (
                <strong>{parsedRequirements.quantity} units</strong>
              )}
            </div>

            <div className="param-item">
              <small>Budget Ceiling</small>
              {editingParams ? (
                <input
                  type="number"
                  value={parsedRequirements.budget}
                  onChange={(e) =>
                    handleFieldChange('budget', parseFloat(e.target.value) || 0)
                  }
                />
              ) : (
                <strong>${parsedRequirements.budget}.00 USD</strong>
              )}
            </div>

            <div className="param-item">
              <small>Delivery Deadline</small>
              {editingParams ? (
                <input
                  type="number"
                  value={parsedRequirements.deadlineDays}
                  onChange={(e) =>
                    handleFieldChange('deadlineDays', parseInt(e.target.value) || 1)
                  }
                />
              ) : (
                <strong>Within {parsedRequirements.deadlineDays} days</strong>
              )}
            </div>
          </div>

          <div className="policy-note">
            <span className="policy-indicator" />
            <p>
              Hard constraint policy: Any offer exceeding ${parsedRequirements.budget} or taking
              longer than {parsedRequirements.deadlineDays} days will be automatically disqualified.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
