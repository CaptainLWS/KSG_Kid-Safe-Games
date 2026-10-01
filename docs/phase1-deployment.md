# Phase 1 deployment

## Vercel

The repository is configured for Vercel with the root `vercel.json`. The application is `apps/ecosystem`.

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

Only the first two may be exposed to browser code. `SUPABASE_SECRET_KEY` is server-only and must never use a `NEXT_PUBLIC_` prefix.

After deployment, configure the Supabase Auth site URL and redirect URL to the deployed application, including `/auth/confirm`.

## CI

GitHub Actions runs dependency installation, Vitest unit tests, TypeScript checking, the Next.js production build, and a high-severity dependency audit.

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as repository Actions secrets.

## Database

Apply migrations through the repository's Supabase migration workflow. The Phase 1 security regression suite is in `supabase/tests/phase1_security_regression.sql`.

Before production sign-in is enabled, turn on Supabase leaked-password protection and review the remaining Supabase Security Advisor findings for pre-existing schemas/functions.