import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  CheckCheck,
  CreditCard,
    Info,
  LayoutTemplate,
  Menu,
  Plus,
  Search,
  Settings,
    Store,
  X,
} from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Brand, Button, Modal, SandboxBadge, ToastContainer } from '../components/ui'
import { usePrototype } from '../context/usePrototype'
import { goalTemplates } from '../data/mockData'

const navItems = [
  { to: '/new', label: 'New transaction', icon: Plus },
  { to: '/transactions', label: 'Transactions', icon: CreditCard },
  { to: '/offers', label: 'Available offers', icon: Store },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)

  const {
    toasts,
    dismissToast,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    isTemplateModalOpen,
    setTemplateModalOpen,
    applyTemplate,
    showToast,
  } = usePrototype()

  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Dynamic search placeholder
  const searchPlaceholder =
    pathname.startsWith('/transactions')
      ? 'Search transactions, order IDs...'
      : pathname.startsWith('/offers')
      ? 'Search prototype offers...'
      : pathname === '/settings'
      ? 'Search configuration...'
      : 'Search transactions, order IDs...'

  // Close notifications dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false)
      }
    }

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationsOpen])

  // Handle global search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    if (!pathname.startsWith('/transactions')) {
      navigate('/transactions')
      showToast(`Filtering transactions for: "${searchQuery}"`, 'info')
    }
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Main Navigation">
        <div className="sidebar-top">
          <NavLink to="/" className="sidebar-brand-link" title="Return to Landing Page">
            <Brand />
          </NavLink>
          <button
            type="button"
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Quick Templates Trigger */}
          <button
            type="button"
            className="nav-link nav-link-button"
            onClick={() => {
              setSidebarOpen(false)
              setTemplateModalOpen(true)
            }}
          >
            <LayoutTemplate size={18} />
            <span>Sample Goals</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-sandbox-box">
            <div className="sandbox-header-row">
              <span className="sandbox-live-dot" />
              <strong>PayPal Sandbox</strong>
            </div>
            <p>Orders v2 API ? Real Sandbox</p>
          </div>

          <div className="sidebar-user">
            <span className="avatar">K</span>
            <div className="sidebar-user-info">
              <strong>Kartik Verma</strong>
              <small>Demo Operator</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Layout Area */}
      <div className="app-main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <form onSubmit={handleSearchSubmit} className="top-search">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="search-clear"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          <div className="topbar-right">
            <SandboxBadge />

            {/* Notification Dropdown */}
            <div className="notification-wrapper" ref={notificationsRef}>
              <button
                type="button"
                className="icon-button notification-trigger"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="View system notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={18} />
                {unreadNotificationsCount > 0 && <i className="notification-dot" />}
              </button>

              {notificationsOpen && (
                <div className="notification-dropdown" role="region" aria-label="System Alerts">
                  <div className="notification-header">
                    <div>
                      <strong>System Activity</strong>
                      <span className="count-tag">{unreadNotificationsCount} unread</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        type="button"
                        className="mark-all-read"
                        onClick={markAllNotificationsRead}
                      >
                        <CheckCheck size={14} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="empty-notifications">
                        <Info size={20} />
                        <p>No recent activity</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`notification-item ${!n.read ? 'unread' : ''}`}
                          onClick={() => markNotificationRead(n.id)}
                        >
                          <div className="notification-item-head">
                            <span className={`status-bullet ${n.type}`} />
                            <strong>{n.title}</strong>
                            <small>{n.time}</small>
                          </div>
                          <p>{n.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Button
              tone="primary"
              size="sm"
              iconLeft={<Plus size={15} />}
              onClick={() => navigate('/new')}
            >
              New Transaction
            </Button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="page-content" id="main-content">
          <Outlet />
        </main>
      </div>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Goal Template Selector Modal */}
      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        title="Select a Procurement Objective"
        description="Choose a realistic commercial scenario to test PACT's intent extraction, constraint checking, and PayPal payment flow."
      >
        <div className="template-modal-list">
          {goalTemplates.map((template) => (
            <div
              key={template.id}
              className="template-card"
              onClick={() => {
                applyTemplate(template.id)
                navigate('/new')
              }}
            >
              <div className="template-card-header">
                <span className="template-category">{template.category}</span>
                <span className="template-budget">Target: ${template.estimatedBudget}</span>
              </div>
              <h3>{template.title}</h3>
              <p>{template.goal}</p>
              <div className="template-card-meta">
                <span>? Required: {template.deadlineDays} Days</span>
                <span>?? Units: {template.itemCount}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
