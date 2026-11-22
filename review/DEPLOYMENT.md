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

## Stripe payments and invoicing scope
- Stripe Checkout: one-time SPICA package payments only.
- Stripe Invoicing: administrator-created draft invoices for review.
- Stripe Tax is OUT OF SCOPE and is not configured or enabled by this application.
- No automatic tax calculation or tax registration workflow is included.
- Checkout: test hosted Checkout with server-defined amounts; no production payment attempt has been made.
- Invoicing: POST /api/create-invoice requires verified admin Firebase claim and creates DRAFT invoices only. Review before finalizing or sending.
- Webhooks: verify signatures and reconcile payment outcomes before fulfillment.
- Never place Stripe secret keys in browser code or GitHub. Use Firebase Secret Manager.

Excluding Stripe Tax from the application does not remove any applicable legal tax obligations. Review obligations separately before selling.
