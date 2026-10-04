import { Search, Shield } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, PageHeader } from '../components/ui'
import { vendors } from '../data/mockData'
import { usePrototype } from '../context/usePrototype'

export function OffersPage() {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const { selectedVendor, selectVendor, showToast } = usePrototype()
  const navigate = useNavigate()

  const filtered = useMemo(
    () =>
      vendors.filter(
        (v) =>
          (categoryFilter === 'All' || v.category === categoryFilter) &&
          v.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query, categoryFilter]
  )

  const handleSelectOffer = (offer: typeof vendors[0]) => {
    selectVendor(offer)
    showToast(`Selected "${offer.name}" offer for current transaction.`, 'info')
    navigate('/plan')
  }

  return (
    <div className="offers-page">
      <PageHeader
        eyebrow="Prototype Catalog"
        title="Available Offers"
        description="Demo supplier offers used by PACT's constraint-checking engine to simulate transaction planning."
      />

      {/* Honest Catalog Disclaimer */}
      <div className="catalog-disclaimer-banner">
        <Shield size={16} />
        <div>
          <strong>Simulation Notice</strong>
          <p>
            Supplier offers and pricing in this catalog are prototype demo data. When you
            authorize an order, payments route through official PayPal Sandbox.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-toolbar">
        <label className="table-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search demo offers by provider name..."
            aria-label="Search demo offers"
          />
        </label>
        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter category"
          >
            <option value="All">All Categories</option>
            <option value="Corporate kits">Corporate Kits</option>
            <option value="Event supplies">Event Supplies</option>
            <option value="Print & branding">Print & Branding</option>
          </select>
        </div>
      </div>

      {/* Clean Offer Table */}
      <div className="transaction-table-wrap">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Category</th>
              <th>Sample Lot (30 Units)</th>
              <th>Delivery Schedule</th>
              <th>Min. Order</th>
              <th>Catalog Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((offer) => {
              const isSelected = selectedVendor.id === offer.id
              return (
                <tr
                  key={offer.id}
                  className={isSelected ? 'selected-row' : ''}
                  onClick={() => selectVendor(offer)}
                >
                  <td>
                    <strong>{offer.name}</strong>
                    <small style={{ display: 'block', color: 'var(--muted)', fontSize: '12px' }}>
                      {offer.shipping}
                    </small>
                  </td>
                  <td>{offer.category}</td>
                  <td>
                    <strong>${offer.amount}.00 USD</strong>
                    <small style={{ display: 'block', color: 'var(--muted)', fontSize: '12px' }}>
                      ${(offer.amount / 30).toFixed(2)} / unit
                    </small>
                  </td>
                  <td>
                    <span>{offer.deliveryDays} business days</span>
                  </td>
                  <td>{offer.minOrder} units</td>
                  <td>
                    <span className="status-pill status-pill-neutral">Demo Offer</span>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      tone={isSelected ? 'primary' : 'secondary'}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectOffer(offer)
                      }}
                    >
                      {isSelected ? 'Selected' : 'Use in Plan'}
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="table-empty">No prototype offers match your filter criteria.</div>
        )}
      </div>
    </div>
  )
}
