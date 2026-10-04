import { useState } from 'react'
import {
  ArrowLeft,
  Check,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, PageHeader, SandboxBadge, TransactionStepper } from '../components/ui'
import { usePrototype } from '../context/usePrototype'
import { paymentService } from '../services/paymentService'

export function PaymentPage() {
  const { selectedVendor, parsedRequirements, goal, showToast } = usePrototype()
  const [state, setState] = useState<'ready' | 'creating' | 'awaiting_approval' | 'capturing' | 'received'>('ready')
  const [activeOrderId, setActiveOrderId] = useState<string>('ORDER-PENDING')
  const [approvalUrl, setApprovalUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const handlePay = async () => {
    try {
      setErrorMessage(null)
      setState('creating')
      showToast('Preparing PayPal Sandbox order...', 'info')

      const order = await paymentService.createPayPalOrder(
        selectedVendor.id,
        selectedVendor.amount,
        parsedRequirements.item,
        parsedRequirements.quantity,
        goal
      )

      setActiveOrderId(order.id)

      if (order.approvalUrl && order.approvalUrl.includes('sandbox.paypal.com')) {
        setApprovalUrl(order.approvalUrl)
        setState('awaiting_approval')
        showToast('PayPal Sandbox order created. Please approve in the sandbox window.', 'info')

        // Launch authentic PayPal Sandbox popup window
        const popup = window.open(
          order.approvalUrl,
          'PayPalSandboxCheckout',
          'width=520,height=700,scrollbars=yes,resizable=yes'
        )

        // Poll for window close to trigger capture
        const timer = window.setInterval(async () => {
          if (popup && popup.closed) {
            window.clearInterval(timer)
            await handleCapture(order.id)
          }
        }, 1500)
      } else {
        // Direct capture for sandbox simulation mode
        await handleCapture(order.id)
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      setState('ready')
      setErrorMessage('PayPal could not create the order. ' + (err.message || 'Please check backend logs.'))
      showToast('PayPal could not create the order.', 'error')
    }
  }

  const handleCapture = async (orderIdToCapture: string) => {
    try {
      setErrorMessage(null)
      setState('capturing')
      showToast('Verifying payment with PayPal backend...', 'info')

      const capture = await paymentService.capturePayPalOrder(orderIdToCapture)

      try {
        localStorage.setItem('pact_last_order_id', capture.orderId)
        localStorage.setItem('pact_last_capture_id', capture.captureId)
      } catch {}

      setState('received')
      showToast(`Payment verified! Capture ID: ${capture.captureId}`, 'success')

      // Transition smoothly to goal completion
      window.setTimeout(() => {
        navigate('/completed')
      }, 1000)
    } catch (err: any) {
      setState('ready')
      setErrorMessage('Your payment was not captured. ' + (err.message || 'Capture verification failed.'))
      showToast('Your payment was not captured.', 'error')
    }
  }

  const isProcessing = state === 'creating' || state === 'capturing'

  return (
    <div className="payment-page">
      <PageHeader
        eyebrow="Step 4 of 5"
        title="PayPal Sandbox Payment"
        description="Authorize payment through PayPal Sandbox. PACT verifies cryptographic capture on the server before finalizing the transaction."
      />

      <TransactionStepper current={4} />

      <div className="payment-layout">
        {/* Main Settlement Gate Card */}
        <section className="checkout-card">
          <div className="paypal-header-row">
            <div className="paypal-brand-mark">
              <span className="paypal-p">P</span>
              <strong>PayPal Sandbox</strong>
            </div>
            <SandboxBadge />
          </div>

          <div className="settlement-status-box">
            <span className="status-label">Transaction State</span>
            <div className="status-val-row">
              <span
                className={`status-pill ${
                  state === 'received'
                    ? 'status-pill-green'
                    : state === 'awaiting_approval' || isProcessing
                    ? 'status-pill-amber'
                    : 'status-pill-blue'
                }`}
              >
                {state === 'ready' && 'Order Ready for Authorization'}
                {state === 'creating' && 'Preparing Transaction...'}
                {state === 'awaiting_approval' && 'Awaiting PayPal Approval'}
                {state === 'capturing' && 'Verifying Payment...'}
                {state === 'received' && 'Payment Verified & Captured'}
              </span>
            </div>
          </div>

          <div className="settlement-details-table">
            <div>
              <span>Authorized Payee</span>
              <strong>{selectedVendor.name} via PACT Escrow</strong>
            </div>
            <div>
              <span>Items</span>
              <strong>
                {parsedRequirements.quantity}x {parsedRequirements.item}
              </strong>
            </div>
            <div>
              <span>PayPal Order ID</span>
              <strong className="mono-text">{activeOrderId}</strong>
            </div>
            <div>
              <span>Environment</span>
              <strong>api-m.sandbox.paypal.com</strong>
            </div>
          </div>

          <div className="checkout-total-banner">
            <span>Total Settlement Due</span>
            <strong>${selectedVendor.amount}.00 USD</strong>
          </div>

          {errorMessage && (
            <div className="payment-error-alert" role="alert">
              <strong>Transaction Error:</strong> {errorMessage}
            </div>
          )}

          {/* Action Trigger Area */}
          <div className="payment-actions-area">
            {state === 'received' ? (
              <div className="payment-success-card">
                <Check size={20} />
                <div>
                  <strong>Payment Captured & Verified</strong>
                  <small>Cryptographic capture verified on backend ledger.</small>
                </div>
              </div>
            ) : state === 'awaiting_approval' ? (
              <div className="approval-active-box">
                <p>
                  PayPal Sandbox checkout window opened. If it was blocked, click below:
                </p>
                {approvalUrl && (
                  <a
                    href={approvalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-paypal"
                    style={{ textDecoration: 'none', display: 'inline-flex', width: '100%', marginBottom: '8px' }}
                  >
                    <span>Open PayPal Sandbox Window</span>
                    <ExternalLink size={15} />
                  </a>
                )}
                <Button
                  tone="primary"
                  size="md"
                  onClick={() => handleCapture(activeOrderId)}
                  disabled={isProcessing}
                  style={{ width: '100%' }}
                >
                  Confirm & Capture Payment
                </Button>
              </div>
            ) : (
              <Button
                tone="paypal"
                size="lg"
                className="full-button"
                onClick={handlePay}
                disabled={isProcessing}
                iconRight={isProcessing ? <RefreshCw size={16} className="spin-icon" /> : undefined}
              >
                {state === 'creating'
                  ? 'Preparing transaction...'
                  : state === 'capturing'
                  ? 'Verifying payment...'
                  : `Authorize $${selectedVendor.amount}.00 in PayPal Sandbox`}
              </Button>
            )}

            {!isProcessing && state !== 'received' && (
              <Button
                tone="quiet"
                size="sm"
                onClick={() => navigate('/review')}
                iconLeft={<ArrowLeft size={14} />}
                style={{ marginTop: '10px' }}
              >
                Return to Review
              </Button>
            )}
          </div>
        </section>

        {/* Security & Sandbox Info */}
        <aside className="payment-security-card">
          <div className="security-card-head">
            <ShieldCheck size={18} />
            <div>
              <h3>Real Sandbox Execution</h3>
              <small>Server-Verified Payment Gate</small>
            </div>
          </div>

          <p>
            PACT connects to the PayPal Orders v2 REST API to create orders and capture payment.
            Transactions route strictly to PayPal's sandbox gateway and will never charge real
            payment methods.
          </p>

          <dl className="security-checklist">
            <div>
              <dt>Strict Human Consent</dt>
              <dd>Requires explicit user confirmation</dd>
            </div>
            <div>
              <dt>Server-Side Capture</dt>
              <dd>Captured via authenticated backend credentials</dd>
            </div>
            <div>
              <dt>Cryptographic Audit</dt>
              <dd>Generates immutable transaction record</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
