import { ArrowLeft, ArrowRight, Check, ShieldCheck, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, PageHeader, TransactionStepper } from '../components/ui'
import { vendors } from '../data/mockData'
import { usePrototype } from '../context/usePrototype'

export function PlanningPage() {
  const {
    goal,
    selectedVendor,
    selectVendor,
    parsedRequirements,
    showToast,
  } = usePrototype()

  const navigate = useNavigate()

  const budgetCeiling = parsedRequirements.budget || 500
  const deadlineCeiling = parsedRequirements.deadlineDays || 5
  const targetQuantity = parsedRequirements.quantity || 30
  const targetItem = parsedRequirements.item || 'Conference Kit'
  const savings = Math.max(0, budgetCeiling - selectedVendor.amount)

  const handleContinueToReview = () => {
    showToast(`Confirmed selection: ${selectedVendor.name}. Proceeding to review.`, 'info')
    navigate('/review')
  }

  return (
    <div className="planning-page">
      <PageHeader
        eyebrow="Step 2 of 5"
        title="Transaction Plan"
        description="PACT evaluated available demo offers against your hard requirements. Review the comparison matrix and recommendation below."
      />

      <TransactionStepper current={2} />

      {/* Prominent Original Objective */}
      <section className="original-goal-banner">
        <span className="eyebrow">Original Request</span>
        <h2>"{goal || `${targetQuantity} ${targetItem}s under $${budgetCeiling} within ${deadlineCeiling} days`}"</h2>
      </section>

      {/* Requirements Summary Grid */}
      <section className="plan-requirements-bar">
        <div>
          <small>Required Item</small>
          <strong>{targetItem}</strong>
        </div>
        <div>
          <small>Target Quantity</small>
          <strong>{targetQuantity} units</strong>
        </div>
        <div>
          <small>Budget Ceiling</small>
          <strong>${budgetCeiling}.00 USD</strong>
        </div>
        <div>
          <small>Delivery Deadline</small>
          <strong>Within {deadlineCeiling} business days</strong>
        </div>
      </section>

      {/* Clean Comparison Table */}
      <section className="table-card">
        <div className="card-heading">
          <div>
            <span className="eyebrow">Constraint Evaluation</span>
            <h2>Options Considered</h2>
          </div>
          <span className="catalog-badge">Demo Catalog Offers</span>
        </div>

        <div className="transaction-table-wrap">
          <table className="transaction-table plan-matrix-table">
            <thead>
              <tr>
                <th>Option / Provider</th>
                <th>Price Total</th>
                <th>Delivery</th>
                <th>Budget Check</th>
                <th>Deadline Check</th>
                <th>Evaluation Result</th>
                <th>Selection</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => {
                const letter = String.fromCharCode(65 + index)
                const fitsBudget = vendor.amount <= budgetCeiling
                const fitsDeadline = vendor.deliveryDays <= deadlineCeiling
                const isQualifying = fitsBudget && fitsDeadline
                const isSelected = selectedVendor.id === vendor.id

                return (
                  <tr
                    key={vendor.id}
                    className={`${isSelected ? 'selected-row' : ''} ${!isQualifying ? 'disqualified-row' : ''}`}
                    onClick={() => {
                      selectVendor(vendor)
                      showToast(`Selected Option ${letter}: ${vendor.name}`, 'info')
                    }}
                  >
                    <td>
                      <strong>
                        Option {letter} ? {vendor.name}
                      </strong>
                      <small style={{ display: 'block', color: 'var(--muted)', fontSize: '12px' }}>
                        {vendor.shipping}
                      </small>
                    </td>

                    <td>
                      <strong>${vendor.amount}.00</strong>
                      <small style={{ display: 'block', color: 'var(--muted)', fontSize: '12px' }}>
                        ${(vendor.amount / targetQuantity).toFixed(2)}/unit
                      </small>
                    </td>

                    <td>
                      <strong>{vendor.deliveryDays} days</strong>
                    </td>

                    <td>
                      {fitsBudget ? (
                        <span className="check-tag qualified">
                          <Check size={13} /> Under ${budgetCeiling}
                        </span>
                      ) : (
                        <span className="check-tag failed">
                          <X size={13} /> Over budget (${vendor.amount - budgetCeiling} excess)
                        </span>
                      )}
                    </td>

                    <td>
                      {fitsDeadline ? (
                        <span className="check-tag qualified">
                          <Check size={13} /> Within {deadlineCeiling} days
                        </span>
                      ) : (
                        <span className="check-tag failed">
                          <X size={13} /> {vendor.deliveryDays - deadlineCeiling} days late
                        </span>
                      )}
                    </td>

                    <td>
                      {vendor.id === 'officekart' ? (
                        <span className="result-pill recommended">RECOMMENDED</span>
                      ) : isQualifying ? (
                        <span className="result-pill qualified">Qualifies</span>
                      ) : (
                        <span className="result-pill disqualified">Does not qualify</span>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`select-btn ${isSelected ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          selectVendor(vendor)
                        }}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Concise Factual AI Recommendation Box */}
      <section className="recommendation-fact-box">
        <div className="recommendation-head">
          <ShieldCheck size={20} className="check-icon" />
          <div>
            <h3>PACT Recommendation</h3>
            <p>
              PACT recommends <strong>{selectedVendor.name}</strong> because it is within the $
              {budgetCeiling} budget and meets the {deadlineCeiling}-day deadline.
            </p>
          </div>
        </div>

        <div className="constraints-checked-grid">
          <div>
            <small>Constraints Verified</small>
            <ul>
              <li>
                <Check size={14} /> Price ${selectedVendor.amount}.00 ? ${budgetCeiling}.00 ceiling
              </li>
              <li>
                <Check size={14} /> Delivery {selectedVendor.deliveryDays} days ? {deadlineCeiling} days
              </li>
              <li>
                <Check size={14} /> Fulfills required {targetQuantity} units
              </li>
            </ul>
          </div>

          <div className="savings-highlight">
            <small>Net Budget Remaining</small>
            <strong>${savings}.00 USD</strong>
            <span>Saved relative to budget ceiling</span>
          </div>
        </div>
      </section>

      {/* Action Row */}
      <div className="plan-actions-footer">
        <Button
          tone="secondary"
          size="md"
          iconLeft={<ArrowLeft size={16} />}
          onClick={() => navigate('/new')}
        >
          Modify Requirements
        </Button>
        <Button
          tone="primary"
          size="md"
          iconRight={<ArrowRight size={16} />}
          onClick={handleContinueToReview}
        >
          Review & Approve Selection
        </Button>
      </div>
    </div>
  )
}
