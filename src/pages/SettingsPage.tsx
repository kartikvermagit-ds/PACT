import {
  CreditCard,
  RefreshCw,
  Server,
  Sparkles,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { PageHeader, SandboxBadge } from '../components/ui'
import { usePrototype } from '../context/usePrototype'
import { apiClient } from '../services/apiClient'

export function SettingsPage() {
  const [backendStatus, setBackendStatus] = useState<any>(null)
  const [checking, setChecking] = useState(false)
  const { showToast } = usePrototype()

  const refreshStatus = async () => {
    setChecking(true)
    try {
      const status = await apiClient.getConfigStatus()
      setBackendStatus(status)
      showToast('Environment status updated.', 'success')
    } catch {
      setBackendStatus({ status: 'offline' })
      showToast('Backend server is offline or unreachable.', 'error')
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    refreshStatus()
  }, [])

  const isOnline = backendStatus && (backendStatus.status === 'ok' || backendStatus.is_sandbox !== undefined)
  const isPaypalLive = Boolean(backendStatus?.paypal_configured || backendStatus?.paypal_sandbox_configured)
  const isGroqLive = Boolean(backendStatus?.groq_configured)
  const isGeminiLive = Boolean(backendStatus?.gemini_configured)
  const activeAi = backendStatus?.active_ai_provider || backendStatus?.ai_provider || 'Heuristic Fallback'

  return (
    <div className="settings-page">
      <PageHeader
        eyebrow="System Configuration"
        title="Settings & Environment"
        description="Manage your PayPal Sandbox gateway, active AI inference provider, and security parameters."
        action={<SandboxBadge />}
      />

      <div className="settings-cards-stack">
        {/* Section 1: Environment & Connectivity */}
        <section className="settings-ref-card">
          <header>
            <div className="settings-head-row">
              <Server size={18} />
              <h2>Environment & Services</h2>
            </div>
            <button
              type="button"
              className="text-button"
              onClick={refreshStatus}
              disabled={checking}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={13} className={checking ? 'spin-icon' : ''} />
              {checking ? 'Checking...' : 'Refresh Status'}
            </button>
          </header>

          <div className="settings-status-grid">
            <div className="settings-status-item">
              <span className="label">FastAPI Engine</span>
              <strong className="val">PACT Core Gateway (:8000)</strong>
              <span className={`status-pill ${isOnline ? 'status-pill-green' : 'status-pill-red'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="settings-status-item">
              <span className="label">Payment Network</span>
              <strong className="val">api-m.sandbox.paypal.com</strong>
              <span className={`status-pill ${isPaypalLive ? 'status-pill-blue' : 'status-pill-purple'}`}>
                {isPaypalLive ? 'Live Keys' : 'Sandbox Simulation'}
              </span>
            </div>

            <div className="settings-status-item">
              <span className="label">Active AI Inference</span>
              <strong className="val">
                {isGroqLive ? 'Groq LLaMA 3.3 70B' : isGeminiLive ? 'Google Gemini 2.5' : 'Deterministic Engine'}
              </strong>
              <span className="status-pill status-pill-green">Active</span>
            </div>
          </div>
        </section>

        {/* Section 2: AI Provider Configuration */}
        <section className="settings-ref-card">
          <header>
            <div className="settings-head-row">
              <Sparkles size={18} />
              <h2>AI Provider Pipeline</h2>
            </div>
          </header>

          <div className="settings-kv-table">
            <div className="settings-kv-row">
              <div>
                <strong>Primary Provider</strong>
                <small>Engine used for natural language intent and constraint extraction</small>
              </div>
              <span className="mono-badge">{activeAi}</span>
            </div>

            <div className="settings-kv-row">
              <div>
                <strong>Groq Cloud API Key</strong>
                <small>LLaMA 3.3 70B Versatile inference</small>
              </div>
              <span className={`status-pill ${isGroqLive ? 'status-pill-green' : 'status-pill-neutral'}`}>
                {isGroqLive ? 'Configured' : 'Not Configured'}
              </span>
            </div>

            <div className="settings-kv-row">
              <div>
                <strong>Google Gemini API Key</strong>
                <small>Gemini 2.5 Flash fallback inference</small>
              </div>
              <span className={`status-pill ${isGeminiLive ? 'status-pill-green' : 'status-pill-neutral'}`}>
                {isGeminiLive ? 'Configured' : 'Not Configured'}
              </span>
            </div>

            <div className="settings-kv-row">
              <div>
                <strong>Deterministic Rule Fallback</strong>
                <small>Zero-latency regex and heuristic constraint engine</small>
              </div>
              <span className="status-pill status-pill-green">Always Available</span>
            </div>
          </div>
        </section>

        {/* Section 3: Payment Environment */}
        <section className="settings-ref-card">
          <header>
            <div className="settings-head-row">
              <CreditCard size={18} />
              <h2>PayPal Environment & Credentials</h2>
            </div>
          </header>

          <div className="settings-kv-table">
            <div className="settings-kv-row">
              <div>
                <strong>Operating Mode</strong>
                <small>Transactions execute exclusively against PayPal Sandbox</small>
              </div>
              <span className="mono-badge">Sandbox Isolation</span>
            </div>

            <div className="settings-kv-row">
              <div>
                <strong>PayPal Client ID</strong>
                <small>OAuth 2.0 application client identifier</small>
              </div>
              <span className={`status-pill ${isPaypalLive ? 'status-pill-green' : 'status-pill-neutral'}`}>
                {isPaypalLive ? 'Configured' : 'Simulation Mode'}
              </span>
            </div>

            <div className="settings-kv-row">
              <div>
                <strong>PayPal Client Secret</strong>
                <small>Stored securely in backend/.env ? Never transmitted to client</small>
              </div>
              <span className={`status-pill ${isPaypalLive ? 'status-pill-green' : 'status-pill-neutral'}`}>
                {isPaypalLive ? 'Configured' : 'Simulation Mode'}
              </span>
            </div>

            <div className="settings-kv-row">
              <div>
                <strong>Webhook Listener</strong>
                <small>Listens for PAYMENT.CAPTURE.COMPLETED events</small>
              </div>
              <span className="mono-badge">/api/webhook/paypal</span>
            </div>
          </div>
        </section>

        {/* Section 4: Operator Profile */}
        <section className="settings-ref-card">
          <header>
            <div className="settings-head-row">
              <User size={18} />
              <h2>Operator Profile</h2>
            </div>
          </header>

          <div className="settings-kv-table">
            <div className="settings-kv-row">
              <div>
                <strong>Account Name</strong>
                <small>Demonstration administrator</small>
              </div>
              <span>Kartik Verma</span>
            </div>

            <div className="settings-kv-row">
              <div>
                <strong>Authorization Policy</strong>
                <small>Requires explicit human consent before any financial commitment</small>
              </div>
              <span className="status-pill status-pill-amber">Strict HITL Enforced</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
