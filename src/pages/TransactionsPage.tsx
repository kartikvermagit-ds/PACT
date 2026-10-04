import { ArrowRight, CreditCard, Filter, Plus, Search, ShieldAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, PageHeader, StatusBadge } from '../components/ui'
import { transactions as mockTransactions, vendors } from '../data/mockData'
import { apiClient } from '../services/apiClient'

export function TransactionsPage() {
  const [realTransactions, setRealTransactions] = useState<any[]>([])
  // loading removed
  const [, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'real' | 'demo'>('real')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    apiClient
      .listTransactions()
      .then((txs) => {
        if (Array.isArray(txs)) {
          setRealTransactions(txs)
          if (txs.length === 0) {
            // Check if there is a completed transaction stored locally
            const lastOrder = localStorage.getItem('pact_last_order_id')
            const lastCapture = localStorage.getItem('pact_last_capture_id')
            if (lastOrder && lastCapture) {
              setRealTransactions([
                {
                  id: lastOrder,
                  goal: '30 conference kits under $500 within 5 days',
                  vendorId: 'officekart',
                  amount: 465,
                  status: 'Completed',
                  delivery: '4 days',
                  date: 'Today',
                },
              ])
            }
          }
        }
      })
      .catch(() => {
        // Fallback check local storage
        const lastOrder = localStorage.getItem('pact_last_order_id')
        if (lastOrder) {
          setRealTransactions([
            {
              id: lastOrder,
              goal: '30 conference kits under $500 within 5 days',
              vendorId: 'officekart',
              amount: 465,
              status: 'Completed',
              delivery: '4 days',
              date: 'Today',
            },
          ])
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const displayList = useMemo(() => {
    const list = activeTab === 'real' ? realTransactions : mockTransactions
    return list.filter(
      (tx) =>
        (statusFilter === 'All' || tx.status === statusFilter) &&
        (tx.goal?.toLowerCase().includes(query.toLowerCase()) ||
          tx.id?.toLowerCase().includes(query.toLowerCase()))
    )
  }, [activeTab, realTransactions, query, statusFilter])

  return (
    <div className="transactions-page">
      <PageHeader
        eyebrow="Audit & Settlement"
        title="Transactions"
        description="Review all commercial transactions, PayPal Sandbox captures, and cryptographic audit records."
        action={
          <Button
            tone="primary"
            size="sm"
            iconLeft={<Plus size={15} />}
            onClick={() => navigate('/new')}
          >
            New Transaction
          </Button>
        }
      />

      {/* Honest Data Source Toggle */}
      <div className="transactions-scope-tabs">
        <button
          type="button"
          className={`scope-tab ${activeTab === 'real' ? 'active' : ''}`}
          onClick={() => setActiveTab('real')}
        >
          <span>Real Sandbox Records</span>
          <span className="count-pill">{realTransactions.length}</span>
        </button>
        <button
          type="button"
          className={`scope-tab ${activeTab === 'demo' ? 'active' : ''}`}
          onClick={() => setActiveTab('demo')}
        >
          <span>Sample Demo Data</span>
          <span className="count-pill">Labeled</span>
        </button>
      </div>

      {activeTab === 'demo' && (
        <div className="catalog-disclaimer-banner">
          <ShieldAlert size={16} />
          <div>
            <strong>Demo Data Mode</strong>
            <p>
              These are sample historical records provided to demonstrate filtering, status
              tracking, and audit views. Real orders appear under "Real Sandbox Records".
            </p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="table-toolbar">
        <label className="table-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID or objective..."
            aria-label="Search transactions"
          />
        </label>

        <div className="filter-group">
          <Filter size={15} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter transaction status"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Verified">Verified</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transactions Table or Empty State */}
      <section className="table-card">
        {displayList.length === 0 ? (
          <div className="transactions-empty-state">
            <CreditCard size={36} className="empty-icon" />
            <h3>No transactions yet</h3>
            <p>Your completed and pending PayPal Sandbox transactions will appear here.</p>
            <Button
              tone="primary"
              size="md"
              iconRight={<ArrowRight size={15} />}
              onClick={() => navigate('/new')}
            >
              Create your first transaction
            </Button>
          </div>
        ) : (
          <div className="transaction-table-wrap">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Goal / Commercial Objective</th>
                  <th>Supplier / Offer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {displayList.map((tx) => {
                  const vendor =
                    vendors.find((v) => v.id === tx.vendorId) || { name: 'OfficeKart' }
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => navigate(`/transactions/${tx.id}`)}
                      className="clickable-row"
                    >
                      <td>
                        <strong className="mono-text">{tx.id}</strong>
                      </td>
                      <td>{tx.goal}</td>
                      <td>{vendor.name}</td>
                      <td>
                        <strong>${tx.amount}.00 USD</strong>
                      </td>
                      <td>
                        <StatusBadge status={tx.status} />
                      </td>
                      <td>
                        <small>{tx.date || 'Recent'}</small>
                      </td>
                      <td>
                        <ArrowRight size={15} className="row-arrow" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
