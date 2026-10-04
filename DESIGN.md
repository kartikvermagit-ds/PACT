# PACT Design System Specification
**Aesthetic: Premium Executive Fintech Dark Theme**

---

## 1. Visual Identity & Philosophy

PACT is built for enterprise executives, procurement leads, and autonomous commerce operators. It avoids generic chatbot bubbles, chaotic neon purple gradients, and gimmicky animations. Instead, it embodies **precision, clarity, trust, and executive control**.

### Core Attributes
- **Deep Obsidian Surfaces**: `#05070B`, `#0A0E17`, `#111827`
- **Solar Amber / Orange Accents**: `#F97316` (Primary Action), `#F59E0B` (Telemetry Highlights)
- **PayPal Brand Blue**: `#0070BA`, `#003087` (Exclusively used for PayPal checkout authorization)
- **Status Indicators**:
  - Success / Completed: `#10B981` (Emerald)
  - Processing / Active: `#3B82F6` (Electric Blue)
  - Warning / Exceeded: `#F59E0B` (Amber)
  - Critical / Failed: `#EF4444` (Crimson)

---

## 2. Typography Hierarchy

- **Primary Font**: Inter / Geist / system sans-serif (`font-sans`) for clean legibility.
- **Headings & Badges**: Space Grotesk / Inter (`font-heading`) with tight tracking (`tracking-tight`).
- **Telemetry & Numbers**: JetBrains Mono (`font-mono`) for currency amounts, order IDs, timestamps, and tokens.

---

## 3. Key Components & Tokens

### Cards & Panels
- Background: `#0B1220` or `#080D16` with `backdrop-blur-md`
- Border: `1px solid rgba(255, 255, 255, 0.08)`
- Hover State: `border-orange-500/40 shadow-[0_0_25px_rgba(249,115,22,0.15)]`

### Buttons
- **Primary Action (Let PACT Plan / Review)**:
  `bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white font-mono shadow-lg shadow-orange-500/20`
- **PayPal Checkout Action**:
  `bg-[#0070BA] hover:bg-[#005ea6] text-white font-sans font-bold shadow-lg shadow-blue-500/25`
- **Secondary / Ghost**:
  `bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60`

### Stepper Progress
1. **Goal Intake** (Objective stated)
2. **AI Plan** (Constraints extracted & offers ranked)
3. **Review** (Human-in-the-Loop approval)
4. **Payment** (PayPal Sandbox Authorization & Capture)
5. **Completed** (Verified transaction receipt & audit trail)
