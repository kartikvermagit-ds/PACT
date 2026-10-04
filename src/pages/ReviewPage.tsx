import { ArrowLeft, ArrowRight, Lock, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, PageHeader, TransactionStepper } from '../components/ui'
import { usePrototype } from '../context/usePrototype'

export function ReviewPage() {
  const { selectedVendor, goal, parsedRequirements, showToast } = usePrototype()
  const navigate = useNavigate()

  const budgetCeiling = parsedRequirements.budget || 500
  const savings = Math.max(0, budgetCeiling - selectedVendor.amount)
  const quantity = parsedRequirements.quantity || 30
  const item = parsedRequirements.item || 'Conference Kit'
  const unitPrice = (selectedVendor.amount / quantity).toFixed(2)

  const handleApprove = () => {
    showToast('Payment authorized. Generating PayPal Sandbox order...', 'success')
    navigate('/payment')
  }

  return (
    <div className="review-page">
      <PageHeader
        eyebrow="Step 3 of 5"
        title="Review & Authorize Payment"
        description="Verify your transaction details. No payment will be executed without your explicit sign-off."
      />

      <TransactionStepper current={3} />

      <div className="financial-review-grid">
        {/* Left Column: Transaction Summary */}
        <section className="review-summary-card">
          <div className="review-card-header">
            <span className="eyebrow">Procurement Summary</span>
            <h2>Order Details</h2>
          </div>

          <div className="review-item-block">
            <div>
              <h3>
                {quantity}x {item}
              </h3>
              <p>
                Selected Provider: <strong>{selectedVendor.name}</strong>
              </p>
            </div>
            <span className="unit-price-pill">${unitPrice} / unit</span>
          </div>

          <dl className="review-spec-list">
            <div>
              <dt>Original Request</dt>
              <dd>"{goal || `${quantity} ${item}s under $${budgetCeiling}`}"</dd>
            </div>
            <div>
              <dt>Delivery Schedule</dt>
              <dd>{selectedVendor.deliveryDays} business days (Within your {parsedRequirements.deadlineDays}-day limit)</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>{selectedVendor.shipping}</dd>
            </div>
            <div>
              <dt>Evaluation Rationale</dt>
              <dd>
                Meets both hard constraints: ${selectedVendor.amount} ? ${budgetCeiling} budget and {selectedVendor.deliveryDays} ? {parsedRequirements.deadlineDays} days.
              </dd>
            </div>
          </dl>

          <div className="review-security-notice">
            <ShieldCheck size={18} />
            <div>
              <strong>Human-in-the-Loop Gate</strong>
              <p>
                PACT never places transactions autonomously. Your authorization is required to
                create the PayPal order.
              </p>
            </div>
          </div>
        </section>

        {/* Right Column: Financial Payment Review */}
        <aside className="payment-review-card">
          <div className="review-card-header">
            <span className="eyebrow">Financial Settlement</span>
            <h2>Payment Review</h2>
          </div>

          <div className="financial-breakdown">
            <div className="breakdown-row">
              <span>Items Subtotal ({quantity} units)</span>
              <strong>${selectedVendor.amount}.00</strong>
            </div>

            <div className="breakdown-row">
              <span>Estimated Shipping</span>
              <span>Free</span>
            </div>

            <div className="breakdown-row total-row">
              <span>Total to Authorize</span>
              <strong className="total-amount">${selectedVendor.amount}.00 USD</strong>
            </div>

            <div className="breakdown-row budget-row">
              <span>Your Budget Ceiling</span>
              <span>${budgetCeiling}.00 USD</span>
            </div>

            <div className="breakdown-row savings-row">
              <span>Budget Remaining (Saved)</span>
              <strong className="savings-amount">${savings}.00 USD</strong>
            </div>
          </div>

          <div className="payment-method-box">
            <div className="gateway-row">
              <Lock size={15} />
              <span>Processed by <strong>PayPal Sandbox</strong></span>
            </div>
            <p>
              Clicking below will create an official PayPal Sandbox Order and open the buyer
              approval window.
            </p>
          </div>

          <div className="approval-action-stack">
            <Button
              tone="primary"
              size="lg"
              className="approve-cta"
              onClick={handleApprove}
              iconRight={<ArrowRight size={16} />}
            >
              Approve & continue with PayPal
            </Button>

            <Button
              tone="secondary"
              size="md"
              onClick={() => navigate('/plan')}
              iconLeft={<ArrowLeft size={16} />}
            >
              Back to Plan
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
