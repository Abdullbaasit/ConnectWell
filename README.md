# ConnectWell — Subscription Edition

Next.js/React frontend and Node.js/Express backend. Ibadan pilot, fictional peers and activities, saved family accounts, explainable matching and Wema payment simulation.

Terminal 1:
```powershell
cd backend
npm ci
Copy-Item .env.example .env
npm run dev
```
Terminal 2 (open from the project root):
```powershell
cd frontend
npm ci
Copy-Item .env.example .env.local
npm run dev
```
Open http://localhost:3000. Register a fictional account.

## Subscription model
Family Membership costs ₦8,000 per calendar month in the demo. This is a pricing hypothesis, not validated demand. All demo activity reservations are included; no per-seat charges. Discovery and matching are available before subscribing. An active subscription is required to reserve any listed activity.

Subscribe & reserve opens checkout, activates membership on successful simulation and reserves the selected activity. Failure does not activate access. Monthly extensions start at the existing expiry when still active, or at the current time when expired. End-of-month dates are clamped to the last valid day. End membership after this period keeps access until expiry. Renewal is manual; no automatic debit runs.

Each subscription payment has a printable QR receipt with plan, amount, payer, beneficiary, billing period and reference. Scan opens a saved demo transaction record, not bank verification. No personal names are exposed by the QR lookup. Use a deployed URL for phone scanning; localhost QR links cannot reach your laptop from a phone. Legacy per-seat receipts can still be viewed.

Wema payments remain simulations, not official Wema transactions. Actual bank integration requires approved merchant credentials. Optional GEMINI_API_KEY in backend/.env enables model concierge; without it, rule-based matching and a labelled fallback are available. Never expose server keys in NEXT_PUBLIC variables.

## Checks
`npm --prefix backend test` tests subscription activation, failures, server-controlled price, retries, duplicate-payment prevention, renewal, included reservations, expiry restrictions, cancellation flag, login persistence and QR-record privacy. `npm --prefix frontend run build` builds the frontend.

See docs/DEPLOYMENT.md for Vercel + Render setup. SQLite needs persistent disk on the backend host. This package does not update your existing Vercel project automatically. Provider workspace is a demo role preview. Peers and organisations are fictional; requests are not sent to real people.
