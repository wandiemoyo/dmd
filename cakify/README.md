# Cakify — on-demand cake marketplace

A mono-repo that includes the Expo mobile client, Next.js admin dashboard, backend API, Supabase schema, and shared packages.

## Tech stack
- **Mobile**: Expo (React Native), React Navigation, React Query, Zustand, Supabase client, Maps + Notifications.
- **Admin**: Next.js (App Router) with Tailwind, React Query, Supabase/REST data fetchers.
- **Backend**: Express + Supabase (data), Stripe webhooks, Vitest-powered tests.
- **Data**: Supabase Postgres with RLS policies and realtime channel for order status.
- **Tooling**: pnpm workspaces, Biome, TypeScript everywhere.

## Getting started
```bash
cd cakify
pnpm install
```

Copy `.env.example` (create one) or export the following for each package:
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=sk_live_or_test
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_API_URL=https://your-api.example.com/api
EXPO_PUBLIC_SUPABASE_URL=$SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EXPO_PUBLIC_API_URL=https://your-api.example.com/api
```

### Supabase
1. Install the CLI and run `supabase start`.
2. Apply schema + seed:
   ```bash
   cd supabase
   supabase db reset --schema schema.sql --seed seed.sql
   ```
3. Enable realtime on `orders`:
   ```sql
   alter publication supabase_realtime add table public.orders;
   ```
4. Store the anon/service keys in the `.env` files used by API, mobile, and admin apps.

### Backend API
```bash
cd apps/api
pnpm dev   # starts Express on http://localhost:4000
pnpm test  # runs Vitest suites for orders + webhooks
```
Key routes:
- `GET /api/bakers` / `:id` / `:id/cakes`
- `GET /api/orders?bakerId=&customerId=`
- `POST /api/orders`
- `PATCH /api/orders/:id/status`
- `POST /api/webhooks/stripe`

Stripe: configure a webhook endpoint pointing to `/api/webhooks/stripe` and use the CLI (`stripe listen --forward-to localhost:4000/api/webhooks/stripe`).

### Mobile app (Expo)
```bash
cd apps/mobile
pnpm start
```
- Update `EXPO_PUBLIC_*` env vars in `app.config` / `.env`.
- The discovery screen shows a map + list with fallback seed data located in `seed/*.json`.
- Checkout triggers the API order creation and subscribes to realtime updates.
- Push notifications: configure Expo push token registration in `services/notifications.ts` and wire to your notification service.

### Admin dashboard (Next.js)
```bash
cd apps/admin
pnpm dev
```
Set `NEXT_PUBLIC_API_URL` to point at the running API. The dashboard reuses shared layout components and renders orders/bakers/promos with live totals.

## Testing
- Backend: `pnpm --filter @cakify/api test`
- Frontend (mobile): `pnpm --filter @cakify/mobile test`
- Run Biome for lint/format: `pnpm biome check .`

## Deployment
- **API**: Deploy to Fly.io, Render, Railway, or Docker on your infra. Set env vars + `NODE_ENV=production`.
- **Supabase**: Use hosted project; run `supabase db push` with provided schema.
- **Admin**: Deploy to Vercel/Netlify. Configure environment variables.
- **Mobile**: Use Expo EAS build.
  - iOS: `eas build --platform ios`, ensure App Store assets + apple credentials are configured.
  - Android: `eas build --platform android`, upload AAB to Play Console.
  - Update `app.json` bundle identifiers (`com.cakify.marketplace`).
  - Configure push notifications in Apple (APNs) + Firebase for production tokens.

## Release checklist
1. Run `pnpm test` & `pnpm biome check .`.
2. Ensure Supabase migrations are applied (`supabase db push`).
3. Update Stripe webhook secrets in API `.env`.
4. For mobile, increment version + build numbers in `app.json`.
5. Submit builds through App Store Connect + Google Play Console with release notes.
