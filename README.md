# PACT ? PayPal Agentic Commerce Transactions

> **"Turn intent into a verified transaction."**

PACT is an autonomous commerce agent platform designed for the PayPal ecosystem. It empowers users to state natural-language commercial objectives, uses AI reasoning to parse constraints and score supplier offers against hard business policies, mandates an explicit **Human-in-the-Loop Approval gate**, executes secure transactions through the **PayPal Sandbox Orders v2 API**, and verifies cryptographic settlement via server-side webhooks before recording immutable audit trails.

---

## ?? Why PACT?

Autonomous agents that make financial purchases without human oversight create massive financial, compliance, and hallucination risks. Conversely, manual procurement across disparate suppliers is slow and tedious.

**PACT solves both:**
1. **Intelligent Intent Extraction**: Interprets messy natural-language requests into structured constraints (item category, target quantity, budget ceiling, delivery deadlines, quality scores).
2. **Deterministic Constraint Policy Gate**: Evaluates and ranks merchant offers, automatically disqualifying any vendor that breaches hard policies (e.g., exceeding budget or missing deadline).
3. **Mandatory Human-in-the-Loop (HITL) Consent**: The AI recommends the optimal vendor but **never** charges a card or creates an unapproved financial commitment. The user must review transparent metrics and sign off.
4. **Server-Verified PayPal Sandbox Execution**: Direct server-to-server integration with PayPal REST APIs (`/v2/checkout/orders` and `/v2/checkout/orders/{id}/capture`) with token caching and cryptographic webhook verification.
5. **Zero-Key Fallback Mode**: Even without live API keys, PACT functions end-to-end with high-fidelity sandboxed simulations, allowing judges to test every feature seamlessly.

---

## ?? End-to-End 8-Step Transaction Lifecycle

```text
       1. USER GOAL
  "30 conference kits under $500 within 5 days"
            ?
            ?
    2. AI INTENT EXTRACTION
  Category: Conference Kit | Qty: 30 | Budget: $500 | Max Days: 5
            ?
            ?
    3. CONSTRAINT VALIDATION & SCORING
  Evaluates suppliers on price, shipping speed, rating, and return policy
  Rejects over-budget or slow vendors
            ?
            ?
    4. AI RECOMMENDATION
  Transparent score matrix & decision justification presented to user
            ?
            ?
    5. HUMAN APPROVAL GATE  ??
  Explicit buyer consent required before financial order creation
            ?
            ?
    6. PAYPAL SANDBOX ORDER CREATION
  FastAPI server calls PayPal Orders v2 API (/v2/checkout/orders)
  Generates Sandbox Approval URL & opens buyer authorization
            ?
            ?
    7. BUYER APPROVAL & CAPTURE
  Server captures authorized transaction (/v2/checkout/orders/{id}/capture)
  Verifies status == "COMPLETED"
            ?
            ?
    8. GOAL COMPLETED & AUDIT RECORD
  Generates immutable audit trail with PayPal Order ID and Capture ID
```

---

## ??? System Architecture

```text
??????????????????????????????????????????????????????????
?               Frontend (React 19 + Vite)               ?
?  - Landing Page & Goal Creator                         ?
?  - Agent Planning & Vendor Decision Matrix             ?
?  - Human Approval Gate & Review Page                   ?
?  - PayPal Sandbox Checkout Gateway                     ?
?  - Verified Completion & Cryptographic Timeline        ?
?  - Settings & Service Connectivity Monitor             ?
??????????????????????????????????????????????????????????
                            ? REST API (JSON)
                            ?
??????????????????????????????????????????????????????????
?                FastAPI Backend (:8000)                 ?
?                                                        ?
?  ????????????????????????    ????????????????????????  ?
?  ?   AI Service Layer   ?    ?    PayPal Service    ?  ?
?  ?  - Groq Provider     ?    ?  - OAuth Token Cache ?  ?
?  ?  - Gemini Provider   ?    ?  - Order Creation    ?  ?
?  ?  - Heuristic Engine  ?    ?  - Order Capture     ?  ?
?  ????????????????????????    ????????????????????????  ?
?                                                        ?
?  ????????????????????????    ????????????????????????  ?
?  ?  Transaction Ledger  ?    ?   Webhook Handler    ?  ?
?  ?  - In-Memory / File  ?    ?  - Capture Listener  ?  ?
?  ?  - Audit Timeline    ?    ?  - Status Updates    ?  ?
?  ????????????????????????    ????????????????????????  ?
??????????????????????????????????????????????????????????
                            ?
            ?????????????????????????????????
            ?                               ?
??????????????????????????      ??????????????????????????
?   PayPal Sandbox API   ?      ?    AI Model APIs       ?
?  api-m.sandbox.paypal  ?      ?  - Groq (LLaMA 3.3)    ?
?  - OAuth 2.0           ?      ?  - Google (Gemini 2.5) ?
?  - Orders v2           ?      ??????????????????????????
??????????????????????????
```

---

## ?? Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (Tested on v20/v22)
- **Python**: v3.10+ (Tested on v3.12)
- **npm** or **pnpm**

---

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (optional ? zero-key simulation works out of the box)
cp .env.example .env

# Start FastAPI server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend will be live at:
- **API Base**: `http://localhost:8000/api`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/health`

---

### 2. Frontend Setup (React + Vite)

In a separate terminal:

```bash
# From the project root
npm install

# Start Vite dev server
npm run dev
```

The frontend will be live at: `http://localhost:5173`

---

## ?? Environment Configuration (`backend/.env`)

Create a `backend/.env` file with your credentials:

```ini
# PayPal Sandbox Credentials (from developer.paypal.com)
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret_here
PAYPAL_MODE=sandbox

# AI Provider API Keys (Pick one or both)
GROQ_API_KEY=gsk_your_groq_api_key_here
GEMINI_API_KEY=AIzaSy_your_gemini_api_key_here

# Active AI Selection: "auto", "groq", "gemini", or "fallback"
ACTIVE_AI_PROVIDER=auto

# Security & CORS
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

> **Security Note:**
> All API keys and secrets stay strictly on the backend. The frontend communicates only with the local FastAPI gateway and has zero access to private credentials. Both `.env` and `backend/.env` are registered in `.gitignore`.

---

## ?? API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/config/status` | Live status of PayPal Sandbox and AI providers |
| `POST` | `/api/goals/parse` | Natural-language intent extraction into structured constraints |
| `POST` | `/api/goals/plan` | Supplier offer evaluation, scoring, and policy validation |
| `GET` | `/api/goals/offers` | Prototype vendor catalog offers |
| `POST` | `/api/orders/create` | Creates PayPal Sandbox Order (`/v2/checkout/orders`) |
| `POST` | `/api/orders/{id}/capture` | Captures authorized PayPal Order (`/v2/checkout/orders/{id}/capture`) |
| `GET` | `/api/orders/{id}` | Fetches PayPal Order details |
| `GET` | `/api/transactions` | Lists all transactions in the audit ledger |
| `GET` | `/api/transactions/{id}` | Fetches detailed transaction audit record |
| `POST` | `/api/webhook/paypal` | Ingests PayPal webhook notifications |

---

## ?? UI/UX Design System

- **Palette**: Dark Executive Fintech
  - Obsidian Base: `#0B0F19`
  - Elevated Surfaces: `#111827`, `#1F2937`
  - PACT Primary Accent: Radiant Warm Amber `#FF6A00` / `#F97316`
  - PayPal Ecosystem Blue: `#0070BA`
  - Status Indicators: Emerald Verified `#10B981`, Amber Warning `#F59E0B`, Crimson Error `#EF4444`
- **Typography**: Inter / Outfit modern geometric sans
- **Motion**: Subtle micro-interactions, responsive hover states, smooth page transitions, and zero layout shift.

---

## ?? Demo Script for Hackathon Judges

1. **Visit Landing Page** (`http://localhost:5173`):
   - Review the value proposition, live metric highlights, and workflow preview.
2. **Start a Goal** (`/new`):
   - Select the quick template *"30 conference kits under $500 within 5 days"* or type your own procurement objective.
   - Click **"Generate Action Plan"**.
3. **Inspect AI Agent Planning** (`/planning`):
   - Notice the structured parameter breakdown (Quantity: 30, Budget: $500, Max Delivery: 5 days).
   - Review the comparative vendor matrix: disqualified candidates have clear rejection badges (e.g. over-budget).
   - Inspect the recommended supplier (**OfficeKart**) scoring 94/100.
4. **Human Approval Gate** (`/review`):
   - Review transparent policy compliance badges.
   - Click **"Approve & Prepare PayPal Order"** to invoke the PayPal Orders v2 API.
5. **Execute PayPal Checkout** (`/pay`):
   - Click **"Open PayPal Sandbox Checkout"** to open the authentic PayPal buyer flow or capture simulation.
   - Confirm captured order ID and webhook verification.
6. **Goal Completed & Cryptographic Audit** (`/completed` & `/transactions/PACT-1048`):
   - Inspect the verified PayPal Capture ID and Order ID.
   - Explore the 8-step chronological transaction timeline and raw webhook event payload.
7. **Service Connectivity** (`/settings`):
   - Open the **Integrations & API** card to view real-time health badges for FastAPI, PayPal Sandbox, and the active AI engine.

---

## ?? License & Attribution

Built for the **PayPal Agentic Commerce Hackathon**.  
? 2026 PACT Team. All rights reserved.
