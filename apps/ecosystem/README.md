# Space LEAF Ecosystem — Phase 1

This app is the first end-to-end vertical slice for the Space LEAF / Jarvondis ecosystem.

## Flow

Register/sign in → protected Digital Ship → world registry → Jarvondis continuity event → safety decision → persistent user state → SHA-256 snapshot → restore on the next authenticated request.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the Supabase Connect dialog.
3. Install dependencies from the repository root with npm or pnpm.
4. Run the app with `npm run dev` from the root.

## Auth security

- Supabase Auth uses SSR cookies through `@supabase/ssr`.
- The Next.js proxy validates the authenticated identity with `supabase.auth.getClaims()` and refreshes the session.
- `/ship/*` and `/api/protected/*` are protected at the request boundary.
- Authenticated pages are dynamic and marked `private, no-store` to prevent session leakage through caches.
- Database authorization is enforced by PostgreSQL RLS; UI route protection is not treated as the database security boundary.
- No service-role/secret key is exposed to the browser.

## Phase 1 security boundaries

Identity → RLS → event authorization → safety status → snapshot integrity. AI and governance authority remain bounded and are not granted implicitly to the user session.
