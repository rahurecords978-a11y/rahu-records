# R.A.H.U. RECORDS — release checklist

## Public site: free static hosting configuration
- Firebase project: rahu-records-website
- Deploy from the `review/` directory with Firebase CLI: `firebase use rahu-records-website` and `firebase deploy --only hosting`.
- This is NOT deployed yet. No CLI credentials or deploy capability are connected to the assistant.
- Firebase Hosting configuration excludes Cloud Functions, Storage and other server files.
- Existing public domain must not be pointed at the preview until the owner has reviewed it.

## Payments
- Direct payments only. No Stripe checkout, tax or Stripe invoicing.
- SPICA packages: $99 / $395.99 / $699.95.
- Paid orders and free $0 demo requests open a prepared email to rahu.records978@gmail.com.
- The customer must SEND the email. Opening an email draft does not submit an order.
- Confirm payment and order details manually before fulfillment.
- Do not invent a Zelle identifier or Cash App handle. Use the owner's verified Chime link and Zelle QR only when explicitly configured.

## Incomplete services — not launch verified
- Authentication provider enablement was shown in screenshots, but real registration/login has not been browser-tested.
- Firestore rules are written but have not been deployed or emulator-tested.
- Admin custom claim not provisioned; private Studio is not operational.
- Artist audio uploads require Cloud Storage; user has not approved Blaze billing.
- Artist approvals depend on the Cloud Function backend, which is not part of static hosting.
- Free demo currently works as an email request, not an automated demo production pipeline.
- No real licensed audio/video assets or physical product inventory have been connected.
- End-to-end browser/mobile accessibility tests and custom-domain verification remain pending.

## Pre-launch acceptance
1. Verify all page links, order mailto drafts and free demo flow in a real browser.
2. Test email/password signup and sign-in against the new Firebase project.
3. Deploy Firestore rules before enabling real artist accounts.
4. Either provide an approved backend for artist moderation/uploads or visibly mark those features as coming soon.
5. Verify domain DNS and TLS only after the preview passes acceptance.
