import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  CheckCheck,
  CreditCard,
  ExternalLink,
  Info,
  LayoutTemplate,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
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
  { to: '/vendors', label: 'Vendors', icon: Store },
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
      ? 'Search transactions, vendors, amounts...'
      : pathname.startsWith('/vendors')
      ? 'Search verified vendors, categories...'
      : pathname === '/settings'
      ? 'Search settings, security, AI controls...'
      : 'Search transactions, vendors, items...'

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

    if (!pathname.startsWith('/transactions') && !pathname.startsWith('/vendors')) {
      navigate('/transactions')
      showToast(`Filtering for: "${searchQuery}"`, 'info')
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
            <span>Goal Templates</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="credits">
            <div>
              <span>Agent Credits</span>
              <strong>12 / 20</strong>
            </div>
            <div className="credit-track" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
              <i style={{ width: '60%' }} />
            </div>
            <small>8 automated evaluations remaining</small>
          </div>

          <div className="sidebar-user">
            <span className="avatar">K</span>
            <div className="sidebar-user-info">
              <strong>Kartik Verma</strong>
              <SandboxBadge compact />
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
                  <X size={13} />
                </button>
              )}
            </form>
          </div>

          <div className="topbar-right">
            <SandboxBadge />

            {/* Notifications Menu */}
            <div className="notifications-wrap" ref={notificationsRef}>
              <button
                type="button"
                className={`icon-button ${unreadNotificationsCount > 0 ? 'has-badge' : ''}`}
                onClick={() => setNotificationsOpen((prev) => !prev)}
                aria-label={`Notifications (${unreadNotificationsCount} unread)`}
                aria-expanded={notificationsOpen}
              >
                <Bell size={18} />
                {unreadNotificationsCount > 0 && <span className="notification-dot" />}
              </button>

              {notificationsOpen && (
                <div className="notifications-popover" role="dialog" aria-label="Notifications panel">
                  <div className="notifications-header">
                    <div>
                      <strong>Notifications</strong>
                      {unreadNotificationsCount > 0 && (
                        <span className="unread-count">{unreadNotificationsCount} unread</span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        type="button"
                        className="mark-all-read"
                        onClick={markAllNotificationsRead}
                      >
                        <CheckCheck size={13} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="notifications-list">
                    {notifications.length === 0 ? (
                      <div className="notifications-empty">No notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <div className="notification-item-icon">
                            {notif.type === 'payment' ? (
                              <ShieldCheck size={15} />
                            ) : notif.type === 'agent' ? (
                              <Plus size={15} />
                            ) : (
                              <Info size={15} />
                            )}
                          </div>
                          <div className="notification-item-body">
                            <div className="notification-title-row">
                              <strong>{notif.title}</strong>
                              <span className="notification-time">{notif.time}</span>
                            </div>
                            <p>{notif.description}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Chip */}
            <button
              type="button"
              className="top-user"
              onClick={() => navigate('/settings')}
              title="Account settings"
            >
              <span className="avatar">K</span>
              <span className="user-name">Kartik Verma</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>

      {/* Global Toast Stack */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Goal Templates Modal */}
      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        eyebrow="Quick Setup"
        title="Start from a Goal Template"
        description="Select a pre-configured procurement scenario to test the PACT AI commerce agent workflow."
        size="lg"
      >
        <div className="template-grid">
          {goalTemplates.map((template) => (
            <div key={template.id} className="template-card">
              <div className="template-card-header">
                <div>
                  <span className="eyebrow">{template.category}</span>
                  <h3>{template.title}</h3>
                </div>
                <strong className="template-budget">${template.estimatedBudget}</strong>
              </div>
              <p className="template-goal">{template.goal}</p>
              <div className="template-meta">
                <span>{template.itemCount} items</span>
                <span>Within {template.deadlineDays} days</span>
              </div>
              <Button
                tone="secondary"
                size="sm"
                fullWidth
                onClick={() => {
                  applyTemplate(template.id)
                  navigate('/new')
                }}
              >
                Use this template <ExternalLink size={13} />
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
