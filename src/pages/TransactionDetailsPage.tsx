import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  CreditCard,
  FileText,
  Package,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader, StatusBadge } from '../components/ui'
import { vendors } from '../data/mockData'
import { usePrototype } from '../context/usePrototype'
import { apiClient } from '../services/apiClient'

interface AuditEvent {
  time: string
  event: string
  detail: string
  status: string
}

const defaultAuditEvents: AuditEvent[] = [
  { time: '10:32:10 AM', event: 'Goal submitted', detail: 'Natural language procurement request received by PACT', status: 'Completed' },
  { time: '10:32:11 AM', event: 'Requirements extracted', detail: 'Item: Conference Kit, Qty: 30, Budget: $500, Max: 5 days', status: 'Completed' },
  { time: '10:32:12 AM', event: 'Offers evaluated', detail: 'Checked catalog offers against hard budget and timeline constraints', status: 'Completed' },
  { time: '10:32:14 AM', event: 'Option selected', detail: 'OfficeKart chosen ($465.00, 4 days) ? $35 under budget ceiling', status: 'Completed' },
  { time: '10:34:02 AM', event: 'Human approval granted', detail: 'User explicitly authorized transaction creation', status: 'Completed' },
  { time: '10:34:05 AM', event: 'PayPal order created', detail: 'Orders v2 API generated sandbox intent with payee escrow', status: 'Completed' },
  { time: '10:34:48 AM', event: 'Payment captured', detail: 'Buyer approved authorization captured on PayPal Sandbox ledger', status: 'Completed' },
  { time: '10:34:49 AM', event: 'Payment verified', detail: 'PAYMENT.CAPTURE.COMPLETED payload confirmed from PayPal', status: 'Completed' },
]

export function TransactionDetailsPage() {
  const { transactionId = 'ORDER-9RX58231' } = useParams()
  const { selectedVendor, parsedRequirements, showToast } = usePrototype()
  const navigate = useNavigate()

  const [orderId, setOrderId] = useState(transactionId)
  const [captureId, setCaptureId] = useState('6KT23510M421')
  const [backendTx, setBackendTx] = useState<any>(null)

  useEffect(() => {
    const savedOrderId = localStorage.getItem('pact_last_order_id')
    const savedCaptureId = localStorage.getItem('pact_last_capture_id')

    if (savedOrderId && (transactionId === savedOrderId || transactionId.startsWith('ORDER-'))) {
      setOrderId(savedOrderId)
    }
    if (savedCaptureId) {
      setCaptureId(savedCaptureId)
    }

    apiClient
      .getTransaction(transactionId)
      .then((tx: any) => setBackendTx(tx))
      .catch(() => {})
  }, [transactionId])

  const vendor = selectedVendor.id ? selectedVendor : vendors[1]
  const amount = backendTx?.amount || vendor.amount || 465
  const quantity = parsedRequirements.quantity || 30
  const item = parsedRequirements.item || 'Conference Kit'

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
    showToast(`${label} copied to clipboard.`, 'success')
  }

  return (
    <div className="transaction-detail-page">
      <button
        type="button"
        className="crumb-button"
        onClick={() => navigate('/transactions')}
      >
        <ArrowLeft size={15} /> Back to Transactions
      </button>

      <PageHeader
        eyebrow={`Transaction Record: ${orderId}`}
        title="Transaction Details & Audit Record"
        description="A complete, transparent record of requirement parsing, constraint evaluation, user authorization, and PayPal Sandbox settlement."
        action={<StatusBadge status="Completed" />}
      />

      <div className="detail-sections-grid">
        {/* SECTION 1: GOAL */}
        <section className="detail-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">1. Commercial Objective</span>
              <h2>User Goal</h2>
            </div>
            <FileText size={18} className="card-head-icon" />
          </div>

          <div className="detail-quote-box">
            <strong>"{quantity} {item}s under ${parsedRequirements.budget || 500} within 5 days"</strong>
          </div>

          <dl className="spec-table">
            <div>
              <dt>Target Item</dt>
              <dd>{item}</dd>
            </div>
            <div>
              <dt>Required Quantity</dt>
              <dd>{quantity} units</dd>
            </div>
            <div>
              <dt>Budget Ceiling</dt>
              <dd>${parsedRequirements.budget || 500}.00 USD</dd>
            </div>
            <div>
              <dt>Required Deadline</dt>
              <dd>Within 5 business days</dd>
            </div>
          </dl>
        </section>

        {/* SECTION 2: DECISION */}
        <section className="detail-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">2. Offer Selection</span>
              <h2>Decision Rationale</h2>
            </div>
            <Package size={18} className="card-head-icon" />
          </div>

          <div className="decision-vendor-highlight">
            <div>
              <small>Selected Provider</small>
              <h3>{vendor.name}</h3>
            </div>
            <span className="status-pill status-pill-green">Policy Qualified</span>
          </div>

          <p className="detail-copy">
            {vendor.name} was selected because it is within the ${parsedRequirements.budget || 500}{' '}
            budget ceiling and complies with the 5-day delivery deadline. Disqualified options failed
            on either budget ceiling or delivery turnaround.
          </p>

          <div className="decision-check-list">
            <span>? Verified within budget (${amount}.00 vs ${parsedRequirements.budget || 500})</span>
            <span>? Fulfills within {vendor.deliveryDays} business days</span>
            <span>? {vendor.shipping} Included</span>
          </div>
        </section>

        {/* SECTION 3: PAYMENT */}
        <section className="detail-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">3. Financial Settlement</span>
              <h2>PayPal Details</h2>
            </div>
            <CreditCard size={18} className="card-head-icon" />
          </div>

          <div className="payment-kv-grid">
            <div>
              <small>Authorized Amount</small>
              <strong>${amount}.00 USD</strong>
            </div>
            <div>
              <small>Payment Gateway</small>
              <strong>PayPal Sandbox (Orders v2)</strong>
            </div>
            <div>
              <small>PayPal Order ID</small>
              <span className="mono-code">
                {orderId}{' '}
                <button
                  type="button"
                  onClick={() => copyToClipboard(orderId, 'Order ID')}
                  aria-label="Copy order ID"
                >
                  <Copy size={12} />
                </button>
              </span>
            </div>
            <div>
              <small>PayPal Capture ID</small>
              <span className="mono-code">
                {captureId}{' '}
                <button
                  type="button"
                  onClick={() => copyToClipboard(captureId, 'Capture ID')}
                  aria-label="Copy capture ID"
                >
                  <Copy size={12} />
                </button>
              </span>
            </div>
          </div>

          <div className="verification-pill-box">
            <ShieldCheck size={16} />
            <span>PAYMENT.CAPTURE.COMPLETED payload confirmed from PayPal</span>
          </div>
        </section>

        {/* SECTION 4: AUDIT TIMELINE */}
        <section className="detail-card full-width-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">4. Cryptographic Provenance</span>
              <h2>Audit Timeline</h2>
            </div>
            <CheckCircle2 size={18} className="card-head-icon" />
          </div>

          <div className="transaction-table-wrap">
            <table className="transaction-table timeline-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Lifecycle Event</th>
                  <th>Description</th>
                  <th>Verification Status</th>
                </tr>
              </thead>
              <tbody>
                {defaultAuditEvents.map((evt) => (
                  <tr key={evt.event}>
                    <td>
                      <small className="mono-text">{evt.time}</small>
                    </td>
                    <td>
                      <strong>{evt.event}</strong>
                    </td>
                    <td>
                      <span>
                        {evt.event === 'PayPal order created'
                          ? `PayPal order ${orderId} generated with sandbox intent`
                          : evt.event === 'Payment captured'
                          ? `Capture ID ${captureId} verified by server webhook`
                          : evt.detail}
                      </span>
                    </td>
                    <td>
                      <span className="status-pill status-pill-green">Verified</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
