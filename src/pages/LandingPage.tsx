import {
  ArrowRight,
  Box,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Layers,
  Menu,
  ShieldCheck,
  Shirt,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brand, Button, SandboxBadge } from '../components/ui'
import { usePrototype } from '../context/usePrototype'
import heroWorkspace from '../assets/pact-hero-workspace.png'

const sampleGoals = [
  { label: '30 conference kits under $500 within 5 days', icon: Box },
  { label: '25 custom polo shirts under $400 in 7 days', icon: Shirt },
  { label: 'Ergonomic office supplies under $300 in 3 days', icon: BriefcaseBusiness },
]

export function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { goal, setGoal } = usePrototype()
  const navigate = useNavigate()

  const handleStart = (customGoal?: string) => {
    if (customGoal) {
      setGoal(customGoal)
    }
    navigate('/new')
  }

  return (
    <div className="landing">
      {/* Navigation */}
      <header className="landing-nav">
        <Link to="/">
          <Brand />
        </Link>
        <nav className={mobileOpen ? 'open' : ''}>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)}>
            How it works
          </a>
          <a href="#example" onClick={() => setMobileOpen(false)}>
            Workflow Example
          </a>
          <Link to="/offers" onClick={() => setMobileOpen(false)}>
            Available Offers
          </Link>
          <Link to="/transactions" onClick={() => setMobileOpen(false)}>
            Transactions
          </Link>
          <Button onClick={() => handleStart()} tone="primary" size="sm">
            Start a transaction <ArrowRight size={15} />
          </Button>
        </nav>
        <button
          className="landing-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero-section hero-photo" id="top">
        <img
          className="hero-photo-bg"
          src={heroWorkspace}
          alt="Fintech commerce workstation"
        />
        <div className="hero-photo-overlay" />
        <div className="hero-copy">
          <div className="hero-badge">
            <ShieldCheck size={14} /> PayPal Agentic Commerce Transactions
          </div>

          <h1>
            Describe what you want to <em>accomplish.</em>
          </h1>

          <p className="hero-description">
            PACT turns your commercial goal into a reviewed, verified PayPal transaction.
            Autonomous constraint validation with mandatory human approval.
          </p>

          {/* Goal Input Workspace */}
          <div className="goal-prompt">
            <label htmlFor="hero-goal">What do you want to accomplish?</label>
            <div>
              <input
                id="hero-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. 30 conference kits under $500 within 5 days..."
              />
              <Button onClick={() => handleStart(goal)} tone="primary">
                Start a transaction <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          {/* Example Triggers */}
          <div className="example-goals">
            <span>Try a realistic objective:</span>
            <div>
              {sampleGoals.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setGoal(label)
                    handleStart(label)
                  }}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="landing-section how-section" id="how-it-works">
        <div className="section-intro">
          <span className="eyebrow">Transaction Architecture</span>
          <h2>How PACT works</h2>
          <p>A deterministic, human-governed transaction pipeline built on PayPal infrastructure.</p>
        </div>

        <div className="work-steps">
          {[
            ['01', 'Describe', 'State your purchasing goal and constraints in plain English.', Layers],
            ['02', 'PACT plans', 'Extracts requirements and scores available offers against hard limits.', Clock3],
            ['03', 'You approve', 'Review transparent recommendation and authorize payment explicitly.', ShieldCheck],
            ['04', 'PayPal processes', 'Executes payment securely through PayPal Sandbox Orders v2 API.', CircleDollarSign],
            ['05', 'PACT verifies', 'Server-verified capture and cryptographic audit timeline generated.', CheckCircle2],
          ].map(([number, title, text, Icon]) => (
            <article key={number as string}>
              <span className="step-num">{number as string}</span>
              <Icon size={20} className="step-icon" />
              <h3>{title as string}</h3>
              <p>{text as string}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Realistic Case Study Section */}
      <section className="landing-section product-promise" id="example">
        <div className="section-intro">
          <span className="eyebrow">Real-World Case Study</span>
          <h2>A complete goal-to-transaction example</h2>
          <p>See how PACT evaluates commercial constraints before asking for your consent.</p>
        </div>

        <div className="example-case-card">
          <div className="case-header">
            <div>
              <span className="eyebrow">User Objective</span>
              <h3>"I need 30 conference kits under $500 within 5 days."</h3>
            </div>
            <span className="status-pill status-pill-green">Verified Transaction</span>
          </div>

          <div className="case-matrix">
            <div className="case-col">
              <h4>1. Extracted Constraints</h4>
              <dl>
                <div>
                  <dt>Item Category</dt>
                  <dd>Conference Kit</dd>
                </div>
                <div>
                  <dt>Target Quantity</dt>
                  <dd>30 units</dd>
                </div>
                <div>
                  <dt>Budget Ceiling</dt>
                  <dd>$500.00 USD</dd>
                </div>
                <div>
                  <dt>Max Delivery Window</dt>
                  <dd>5 business days</dd>
                </div>
              </dl>
            </div>

            <div className="case-col">
              <h4>2. Evaluated Offers</h4>
              <ul className="case-evaluation-list">
                <li className="disqualified">
                  <strong>Option A ($430.00)</strong>
                  <span>6 days delivery ? ? Misses 5-day deadline</span>
                </li>
                <li className="qualified">
                  <strong>Option B ($465.00) ? RECOMMENDED</strong>
                  <span>4 days delivery ? ? $35 under budget ? ? Meets deadline</span>
                </li>
                <li className="disqualified">
                  <strong>Option C ($520.00)</strong>
                  <span>3 days delivery ? ? Exceeds $500 budget</span>
                </li>
              </ul>
            </div>

            <div className="case-col">
              <h4>3. Verified Settlement</h4>
              <dl>
                <div>
                  <dt>Selected Supplier</dt>
                  <dd>OfficeKart (Option B)</dd>
                </div>
                <div>
                  <dt>Authorized Total</dt>
                  <dd>$465.00 USD</dd>
                </div>
                <div>
                  <dt>PayPal Order ID</dt>
                  <dd>ORDER-9RX58231</dd>
                </div>
                <div>
                  <dt>Payment Capture ID</dt>
                  <dd>6KT23510M421 (COMPLETED)</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta" id="start">
        <SandboxBadge />
        <h2>
          Ready to turn intent into a verified transaction?
        </h2>
        <p>No fake counters. No unapproved charges. Real PayPal Sandbox execution.</p>
        <Button onClick={() => handleStart()} tone="primary" size="lg">
          Start a transaction <ArrowRight size={17} />
        </Button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <Brand />
        <span>? 2026 PACT ? PayPal Agentic Commerce Transactions ? Sandbox Prototype</span>
        <div>
          <Link to="/offers">Available Offers</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/settings">Settings</Link>
        </div>
      </footer>
    </div>
  )
}
