# PACT — AI Commerce Agent

> Turn intent into a verified transaction.

PACT is an interactive fintech commerce prototype that converts a natural-language purchasing goal into a transparent, human-approved PayPal Sandbox transaction. It demonstrates a complete product journey: goal intake, structured AI planning, vendor comparison, approval, payment verification, and transaction tracking.

## Highlights

- Premium dark fintech interface with an orange PACT design system
- Complete, navigable commerce flow from landing page to verified completion
- Structured requirement extraction and transparent vendor recommendation criteria
- Explicit human approval before PayPal payment
- PayPal Sandbox checkout and webhook-verification UI
- Searchable and filterable transaction dashboard
- Vendor discovery, vendor profiles, and product catalog presentation
- Interactive settings, toast feedback, tabs, filters, and vendor selection
- Responsive dashboard navigation and mobile-first layout adaptations

## Core Journey

```text
Landing Page
  → Create Goal
  → Agent Plan & Vendor Comparison
  → Review & Approve
  → PayPal Sandbox Payment
  → Payment Verification
  → Goal Completed
  → Transaction Details
```

The default demo scenario is: **“I need 30 conference kits under $500 within 5 days.”**

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4 (Vite plugin)
- React Router
- Lucide React icons
- Custom CSS design system

## Run Locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Project Structure

```text
src/
├── components/     # Reusable product UI: stepper, badges, cards, timelines
├── context/        # Shared goal, vendor-selection, and toast state
├── data/           # Consistent realistic mock transaction and vendor data
├── layouts/        # Responsive authenticated application shell
├── pages/          # Landing, transaction, vendor, and settings screens
├── services/       # Mock AI and PayPal integration boundaries
├── styles/         # PACT design tokens and responsive UI system
└── types/          # Shared TypeScript models
```

## Integration Boundaries

The prototype deliberately keeps AI and PayPal concerns behind service interfaces:

- `aiService`: `parseGoal`, `extractRequirements`, `findVendors`, `compareVendors`, and `generateRecommendation`
- `paymentService`: `createPayPalOrder`, `capturePayPalOrder`, and `getPayPalOrderStatus`

These mocks can be replaced by an authenticated backend without allowing raw LLM output to trigger a payment. The intended production sequence is:

```text
LLM → structured decision → validation / policy layer → payment tool → PayPal
```

## Product Principle

**AI recommends. You authorize. PACT verifies.**

PACT never represents a payment as automatically completed by AI; authorization remains clearly human-controlled throughout the experience.
