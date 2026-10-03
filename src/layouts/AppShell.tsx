import { Bell, CreditCard, LayoutTemplate, Menu, Plus, Search, Settings, Store, X } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Brand, SandboxBadge } from '../components/ui'
import { usePrototype } from '../context/usePrototype'

const navItems = [
  { to: '/new', label: 'New transaction', icon: Plus },
  { to: '/transactions', label: 'Transactions', icon: CreditCard },
  { to: '/vendors', label: 'Vendors', icon: Store },
  { to: '/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toast } = usePrototype()
  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-top"><Brand /><button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={20} /></button></div>
      <nav className="sidebar-nav">{navItems.map(({ to, label, icon: Icon }) => <NavLink key={label} to={to} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18} />{label}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="credits"><div><span>Credits</span><strong>12 / 20</strong></div><div className="credit-track"><i /></div><small>8 agent runs remaining</small></div><div className="sidebar-user"><span className="avatar">K</span><div><strong>Kartik Verma</strong><SandboxBadge compact /></div></div></div>
    </aside>
    {sidebarOpen && <button aria-label="Close navigation overlay" className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    <main className="app-main"><header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><label className="top-search"><Search size={17} /><input placeholder="Search transactions, vendors..." /></label><div className="topbar-right"><SandboxBadge /><button className="icon-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-user"><span className="avatar">K</span><span>Kartik Verma</span></div></div></header><div className="app-content"><Outlet /></div></main>
    {toast && <div className="toast">{toast}</div>}
  </div>
}
