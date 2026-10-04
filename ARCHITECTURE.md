
# PACT System Architecture
**PayPal Agentic Commerce Transactions**
*"Turn intent into a verified transaction."*

---

## 1. High-Level Concept

PACT empowers users to state commercial objectives in natural language (e.g. *"I need 30 conference kits under $500 within 5 days"*). An autonomous AI agent parses the objective, extracts constraints, evaluates available vendor offers, recommends the optimal choice, presents a Human-in-the-Loop approval screen, executes the transaction via the PayPal Sandbox REST API, verifies the payment server-side, and records an immutable audit trail.

---

## 2. End-to-End Sequence Flow

```
[ USER ]                     [ REACT FRONTEND ]            [ FASTAPI BACKEND ]           [ AI (GROQ / GEMINI) ]         [ PAYPAL SANDBOX ]
   |                                 |                             |                              |                             |
   | 1. Enters Goal Text             |                             |                              |                             |
   |-------------------------------->|                             |                              |                             |
   |                                 | 2. POST /api/goals/parse    |                              |                             |
   |                                 |---------------------------->|                              |                             |
   |                                 |                             | 3. Structured Prompt         |                             |
   |                                 |                             |----------------------------->|                             |
   |                                 |                             | 4. GoalRequirements JSON     |                             |
   |                                 |                             |<-----------------------------|                             |
   |                                 | 5. Extracted Requirements   |                              |                             |
   |                                 |<----------------------------|                              |                             |
   |                                 |                             |                              |                             |
   |                                 | 6. POST /api/goals/plan     |                              |                             |
   |                                 |---------------------------->|                              |                             |
   |                                 |                             | 7. Candidate Offers + Goal   |                             |
   |                                 |                             |----------------------------->|                             |
   |                                 |                             | 8. AgentDecision JSON        |                             |
   |                                 |                             |<-----------------------------|                             |
   |                                 | 9. Ranked Offers + Decision |                              |                             |
   |                                 |<----------------------------|                              |                             |
   |                                 |                             |                              |                             |
   | 10. Reviews & Clicks "Approve"  |                             |                              |                             |
   |-------------------------------->|                             |                              |                             |
   |                                 | 11. POST /api/orders/create |                              |                             |
   |                                 |---------------------------->|                              |                             |
   |                                 |                             | 12. OAuth Token (Cached)     |                             |
   |                                 |                             |----------------------------------------------------------->|
   |                                 |                             | 13. Access Token Received    |                             |
   |                                 |                             |<-----------------------------------------------------------|
   |                                 |                             | 14. POST /v2/checkout/orders |                             |
   |                                 |                             |----------------------------------------------------------->|
   |                                 |                             | 15. Order ID + Approval Link |                             |
   |                                 |                             |<-----------------------------------------------------------|
   |                                 | 16. PayPal Order Created    |                              |                             |
   |                                 |<----------------------------|                              |                             |
   |                                 |                             |                              |                             |
   | 17. Approves in Sandbox Flow    |                             |                              |                             |
   |--------------------------------------------------------------------------------------------------------------------------->|
   | 18. Sandbox Approval Completed  |                             |                              |                             |
   |<---------------------------------------------------------------------------------------------------------------------------|
   |                                 | 19. POST /api/orders/capture|                              |                             |
   |                                 |---------------------------->|                              |                             |
   |                                 |                             | 20. POST /capture            |                             |
   |                                 |                             |----------------------------------------------------------->|
   |                                 |                             | 21. Capture ID + COMPLETED   |                             |
   |                                 |                             |<-----------------------------------------------------------|
   |                                 |                             | 22. Record Transaction State |                             |
   |                                 | 23. Verified Completed State|                              |                             |
   |                                 |<----------------------------|                              |                             |
   | 24. Displays Verified Objective |                             |                              |                             |
   |<--------------------------------|                             |                              |                             |
```

---

## 3. Component Architecture

### Frontend (React 19 + TypeScript + Tailwind 4)
- **AppShell**: Navigation, status indicators, sandbox indicator, notification drawer.
- **Goal Intake (`/new`)**: Natural language intent entry, template chips, real-time input sanity check.
- **Planning View (`/plan`)**: 6-step agent timeline, structured constraint badges, candidate evaluation grid.
- **Review & Authorization (`/review`)**: Human-in-the-Loop decision gate, policy checks, price comparison breakdown.
- **PayPal Checkout (`/payment`)**: Sandbox authorization container, funding source breakdown, live payment execution.
- **Completed View (`/completed`)**: Success telemetry, transaction hash, budget savings metric, PDF receipt export.
- **Audit Ledger (`/transactions`)**: Full compliance log of all transactions and agent steps.

### Backend (Python 3.12 + FastAPI)
- **`backend/config.py`**: Pydantic Settings with env parsing and zero secret leakage.
- **`backend/services/paypal_service.py`**:
  - `get_access_token()`: OAuth 2.0 Client Credentials token management with expiration caching.
  - `create_order()`: Orders API v2 integration with structured items, amounts, and return URLs.
  - `capture_order()`: Order capture with transaction verification.
  - `verify_webhook()`: HMAC signature verification for incoming PayPal webhooks.
- **`backend/services/ai/`**:
  - `base.py`: Provider interface defining `parse_goal()`, `evaluate_offers()`.
  - `groq_provider.py`: High-speed Llama-3 inference via Groq SDK.
  - `gemini_provider.py`: Google Gemini 1.5 / 2.0 Flash integration.
  - `ai_service.py`: Provider switcher (`AI_PROVIDER=groq|gemini`) with automated fallback and JSON schema validation.
- **`backend/routers/`**:
  - `/api/goals`: Intent parsing and agent decision planning.
  - `/api/orders`: PayPal order lifecycle (create, capture, status).
  - `/api/transactions`: Transaction audit store and query endpoints.
  - `/api/config/status`: Safe frontend status check (never returns raw keys).

---

## 4. Security Principles

1. **Zero Secret Exposure**: PayPal Client Secret, Groq API Key, and Gemini API Key reside strictly in `backend/.env`.
2. **Server-Side Verification**: Client notifications never mark a payment as completed. Completion requires server-verified capture from PayPal Sandbox.
3. **Explicit Human Authorization**: The AI never creates a payment order without explicit user consent on `/review`.
