# Supabase stack for Cakify

## Getting started

1. Install the CLI and start the local stack:
   ```bash
   supabase start
   ```
2. Apply schema and seed data:
   ```bash
   supabase db reset --seed seed.sql --schema schema.sql
   ```
3. Copy the generated anon + service keys into `.env` files used by the API, mobile app, and admin dashboard.

## Tables & policies
- `profiles` mirrors `auth.users` records and stores roles.
- `bakers`, `cakes` power storefront discovery with location JSON payloads for maps.
- `orders`, `order_items`, `order_status_events`, and `ratings` manage the order lifecycle.
- `promotions` and `payout_requests` unblock admin workflows.
- Row Level Security protects profile + order data by default; the API uses the service role key for server-side transitions.

## Realtime
Enable the `orders` table for realtime updates to let the mobile app subscribe to status changes:
```sql
alter publication supabase_realtime add table public.orders;
```
