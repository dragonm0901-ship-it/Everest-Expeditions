# Everest Expeditions

A React + Vite travel company website with:

- destination, experience, and story detail pages
- a validated inquiry flow and serverless inquiry endpoint
- SQLite-backed inquiry persistence and a simple internal admin dashboard
- SEO metadata, sitemap, robots, manifest, and social card assets
- accessibility upgrades such as skip links, focus states, and semantic FAQ controls
- deployment scaffolding for SPA rewrites and baseline security headers
- Node-based content and inquiry validation tests plus CI

## Commands

```bash
npm run dev
npm run test
npm run build
npm run check
```

## Inquiry endpoint

The frontend submits inquiries to `VITE_INQUIRY_ENDPOINT`, which defaults to `/api/inquiries`.

Environment variables:

- `VITE_INQUIRY_ENDPOINT`
- `ALLOWED_ORIGIN`
- `INQUIRY_WEBHOOK_URL`
- `INQUIRY_DB_FILE`
- `ADMIN_API_TOKEN`

The inquiry API stores every submission in SQLite. If `INQUIRY_WEBHOOK_URL` is set, the API also forwards inquiries to that webhook and records the sync status in the database.

## Admin dashboard

Visit `/admin` and sign in with the token configured in `ADMIN_API_TOKEN`.

The dashboard supports:

- inquiry search and status filters
- planner assignment
- admin notes
- inquiry status and CRM sync status updates

## Deployment notes

- `public/_redirects` supports SPA rewrites on Netlify-style hosts.
- `public/_headers` sets baseline security headers on Netlify-style hosts.
- `vercel.json` adds rewrites and headers for Vercel deployments.
- Because the app uses `BrowserRouter`, your host must rewrite unknown routes to `index.html`.



Remaining audits and edits
Enterprise Gaps
Your site is now credible as a boutique travel company website, but it is not enterprise-grade yet. The remaining gaps are mostly platform, operations, compliance, and scale concerns rather than visual or brochure issues.

# Priority 1

A real data store. Right now inquiries can fall back to JSON file storage, which is acceptable for dev or low-volume backup, but not for production-scale lead operations. You need a database-backed system with retention rules, backups, and searchable traveler records.
Admin and ops tooling. Staff still have no internal dashboard to review inquiries, assign planners, update statuses, track supplier confirmations, or manage trip lifecycle.
CRM integration. The inquiry endpoint can send to a webhook, but there is no first-class CRM pipeline yet for lead assignment, follow-ups, conversion stages, or sales reporting.
Authentication and authorization. There is no staff login, role-based access control, or protected internal tools.
Stronger anti-abuse. You have validation, rate limiting, and a honeypot, but enterprise-grade lead forms usually also use CAPTCHA, bot scoring, abuse analytics, and alerting.
Formal observability. Error and analytics hooks exist, but you still need actual production providers configured for monitoring, uptime alerts, request logs, and funnel tracking.

# Priority 2

CMS or structured content admin. Content is still code-driven in siteContent.js. For a growing travel business, marketing and operations teams need a content workflow without code changes.
Payment and booking operations. There is still no checkout, deposit collection, invoice management, or payment reconciliation layer.
Supplier/inventory system. No live availability, room blocks, pricing sync, supplier contracts, blackout windows, or operational inventory model.
Traveler portal. Guests cannot log in to see itineraries, documents, invoices, support instructions, or live trip updates.
Document workflow. No support for waivers, travel documents, insurance upload, guest lists, passport capture, or signed approvals.
Audit logging. No immutable record of who changed what, when, and why across inquiry handling or trip operations.

# Priority 3

Legal and compliance hardening. The policy pages are strong website scaffolding, but not a substitute for legal review, privacy compliance review, jurisdiction-specific consumer protections, or travel-industry regulatory review.
Security maturity. No WAF, no secret rotation workflow, no secure file storage, no dependency audit automation, no SAST/DAST, and no incident-response workflow.
Accessibility audit at production depth. The major issues are improved, but enterprise-grade launch usually includes manual keyboard testing, screen-reader QA, contrast verification, and mobile assistive-tech checks.
SEO maturity. The foundations are now good, but enterprise-grade SEO means editorial content cadence, backlinks, market pages, route-level image optimization, search console integration, analytics attribution, and content performance review.
Internationalization and localization. No multi-language support, no multi-currency handling, no region-specific policy text, and no timezone-aware traveler communication system.
What You Are Ready For Now
You are ready for:

a polished boutique-travel brand launch
lead capture and manual planner follow-up
SEO indexing of core destination, story, and company pages
small-team operations with low to moderate inquiry volume
You are not yet ready for:

high-volume automated booking operations
multi-agent staff workflows
enterprise compliance expectations
serious traveler account management
OTA-style instant booking
Recommended Next Build Order

Database + CRM integration
Admin dashboard for inquiries and trip status
Monitoring, analytics, alerts, and abuse protection
CMS/content management
Payments and traveler portal
106: Legal/security/compliance hardening

## Production Hardening Checklist

The following security and performance improvements have been implemented for production readiness:

- [x] **Rate Limiting**: Protects `/api/admin/session` from brute-force attacks (5 attempts / 15 mins).
- [x] **Lazy Loading**: The admin dashboard is isolated in a separate code bundle to improve public site performance.
- [x] **SEO Privacy**: Admin routes are protected with `noindex` and `nofollow` to prevent search engine indexing.

### Future Enterprise Gaps

To reach government-grade or high-scale enterprise standards, the following steps are recommended:

1. **Managed Database**: Migrate from local SQLite to a managed provider (e.g., PostgreSQL via Supabase or Turso for SQLite) to ensure data persistence on ephemeral hosts like Vercel.
2. **Persistent Rate Limiting**: Migrate the in-memory rate limiter to a Redis-backed store for multi-instance consistency.
3. **MFA (Multi-Factor Authentication)**: Implement TOTP or email-based secondary verification for admin accounts.
4. **Audit Logging**: Implement immutable logs of all administrative actions for compliance and security auditing.
# Everest-Expeditions
