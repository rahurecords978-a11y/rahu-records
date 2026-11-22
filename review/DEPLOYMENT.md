# R.A.H.U. RECORDS — deployment status
This is a development branch, not a published website.

## Payment architecture (approved)
- Direct customer payment only: Zelle, Chime or Cash App after the business confirms the order and payment instructions.
- No Stripe Checkout, Stripe Tax, or payment processor in the customer journey.
- SPICA prices: 1 song $99, 5 songs $395.99, 10 songs $699.95. Free 90-second demo is separate.
- Paid order form composes an email to rahu.records978@gmail.com. It does not collect funds, claim payment, or persist order records.
- Do not publish unverified payment handles or imply Chime/Zelle/Cash App business eligibility without confirmation.

## Remaining before production
- Test all frontend flows and media on real devices.
- Choose an economical hosting strategy. Firebase is optional; its storage/functions features are not required for the direct-order email form.
- Artist uploads and member accounts still require an authenticated backend and secure storage; do not claim these features work until tested.
- Private Creator Studio must be protected by server-side authorization. Administrator claims must be provisioned securely.
- Free demo currently requires a server endpoint and is not operational until deployed. Avoid taking requests through a nonfunctional form.
- Confirm all public content, product inventory, rights and media assets.
- Deploy to a preview URL, test, and obtain final approval before changing the live domain.
