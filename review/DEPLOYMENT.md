# THE NEW SEASON — private review build
This branch is NOT production-ready. It intentionally does not publish to the live site.
## Required before launch
1. Create a NEW Firebase project, enable Authentication, Firestore, Storage, and Functions.
2. Set admin custom claim only through trusted administrative tooling. Artist approval must be performed server-side and issue artistApproved custom claims after review.
3. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in Firebase Secret Manager, and PUBLIC_SITE_ORIGIN in function environment. Configure the webhook endpoint.
4. Connect the frontend to Firebase Auth, media queries and secure API endpoints. Current review/index.html is visual and informational only.
5. Implement a separate private administrator app and approved artist dashboard, test role boundaries, moderation, refunds, email delivery, taxes, and security rules in the emulator.
6. Verify assets, song rights, product inventory, and accessibility. Do not expose Creator Studio as a public link.
7. Review and explicitly approve before any production deployment.

## Stripe test account audit (2026-11-22)
- Stripe connection: R.A.H.U. RECORDS sandbox only.
- Stripe Tax settings: pending, missing head_office; no test registrations.
- Keep automatic_tax disabled until verified business address, product tax codes, applicable tax registrations, and tax-inclusive/exclusive price policy are confirmed.
- Checkout: test hosted Checkout with server-defined amounts; no production payment attempt has been made.
- Invoicing: POST /api/create-invoice requires verified admin Firebase claim and creates DRAFT invoices only. Review before finalizing or sending. Never create invoices from untrusted browser totals.
- Webhook: verify signatures against raw body, test checkout.session.completed, asynchronous payment events and refunds; use Stripe event IDs for idempotency and reconcile payment state before fulfillment.
- Never place Stripe secret keys in browser code or GitHub. Use Firebase Secret Manager.
