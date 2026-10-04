import { ArrowRight, Check, CheckCircle2, Copy, ExternalLink, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, PageHeader, StatusBadge, TransactionStepper } from '../components/ui'
import { usePrototype } from '../context/usePrototype'

const completionSteps = [
  'Goal created',
  'Requirements analyzed',
  'Option selected',
  'User approved',
  'PayPal order created',
  'Payment captured',
  'Payment verified',
  'Goal completed',
]

export function CompletedPage() {
  const { selectedVendor, parsedRequirements, showToast } = usePrototype()
  const navigate = useNavigate()

  const [orderId, setOrderId] = useState('ORDER-9RX58231')
  const [captureId, setCaptureId] = useState('6KT23510M421')

  useEffect(() => {
    const savedOrderId = localStorage.getItem('pact_last_order_id')
    const savedCaptureId = localStorage.getItem('pact_last_capture_id')
    if (savedOrderId) setOrderId(savedOrderId)
    if (savedCaptureId) setCaptureId(savedCaptureId)
  }, [])

  const budgetCeiling = parsedRequirements.budget || 500
  const savings = Math.max(0, budgetCeiling - selectedVendor.amount)
  const quantity = parsedRequirements.quantity || 30
  const item = parsedRequirements.item || 'Conference Kit'

  const copyTransactionIds = () => {
    const text = `PayPal Order ID: ${orderId}\nPayPal Capture ID: ${captureId}\nAmount: $${selectedVendor.amount}.00 USD\nSupplier: ${selectedVendor.name}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
    showToast('Transaction IDs copied to clipboard.', 'success')
  }

  return (
    <div className="completed-page">
      <PageHeader
        eyebrow="Step 5 of 5"
        title="Payment Verified"
        description="Your transaction is verified on the PayPal Sandbox ledger and recorded in the audit trail."
        action={<StatusBadge status="Completed" />}
      />

      <TransactionStepper current={5} />

      <div className="completion-layout">
        {/* Main Settlement Details */}
        <section className="completion-summary-card">
          <div className="completion-verified-hero">
            <div className="verified-badge-icon">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <span className="eyebrow">Settlement Confirmed</span>
              <h2>Goal completed successfully</h2>
              <p>
                Payment for {quantity}x {item} has been captured by PayPal Sandbox. Supplier{' '}
                <strong>{selectedVendor.name}</strong> has confirmed order placement.
              </p>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="completion-stat-grid">
            <div>
              <small>Amount Paid</small>
              <strong>${selectedVendor.amount}.00 USD</strong>
            </div>
            <div>
              <small>Est. Delivery</small>
              <strong>{selectedVendor.deliveryDays} business days</strong>
            </div>
            <div>
              <small>Budget Saved</small>
              <strong className="savings-val">${savings}.00 USD</strong>
            </div>
            <div>
              <small>Payment Status</small>
              <span className="status-pill status-pill-green">COMPLETED</span>
            </div>
          </div>

          {/* Transparent Identifiers Box */}
          <div className="completion-id-box">
            <div>
              <span>PayPal Order ID</span>
              <strong className="mono-text">{orderId}</strong>
            </div>
            <div>
              <span>PayPal Capture ID</span>
              <strong className="mono-text">{captureId}</strong>
            </div>
            <button type="button" className="text-button" onClick={copyTransactionIds}>
              <Copy size={13} /> Copy IDs
            </button>
          </div>

          {/* Action Row */}
          <div className="completion-actions-row">
            <Button
              tone="primary"
              size="md"
              onClick={() => navigate(`/transactions/${orderId}`)}
              iconRight={<ExternalLink size={15} />}
            >
              View transaction record
            </Button>
            <Button
              tone="secondary"
              size="md"
              onClick={() => navigate('/new')}
              iconRight={<ArrowRight size={15} />}
            >
              Start another transaction
            </Button>
          </div>
        </section>

        {/* 8-Step Complete Verification Timeline */}
        <aside className="completion-timeline-panel">
          <div className="timeline-panel-head">
            <ShieldCheck size={18} />
            <div>
              <h3>Audit Lifecycle</h3>
              <small>End-to-End Execution Sequence</small>
            </div>
          </div>

          <ol className="audit-step-list">
            {completionSteps.map((stepName) => (
              <li key={stepName} className="audit-step-item completed">
                <span className="step-check">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="step-name">{stepName}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  )
}
