-- Enable extensions
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'customer',
  display_name text,
  avatar_url text,
  phone_number text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Profiles are editable by owners" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Bakers
create table if not exists public.bakers (
  id text primary key,
  owner_id uuid references public.profiles(id),
  name text not null,
  business_name text not null,
  description text,
  rating numeric default 0,
  delivery_radius_km numeric default 5,
  min_lead_time_hours integer default 6,
  avatar_url text,
  hero_image_url text,
  location jsonb not null,
  specialties text[] default '{}',
  is_verified boolean default false,
  created_at timestamptz default now()
);

alter table public.bakers enable row level security;
create policy "Bakers readable by all" on public.bakers for select using (true);
create policy "Bakers manageable by owner" on public.bakers for all using (auth.uid() = owner_id);

-- Cakes
create table if not exists public.cakes (
  id text primary key,
  baker_id text references public.bakers(id) on delete cascade,
  title text not null,
  description text,
  price numeric not null,
  currency text not null default 'USD',
  photo_url text,
  prep_time_minutes integer,
  tags text[] default '{}',
  is_featured boolean default false
);

alter table public.cakes enable row level security;
create policy "Cakes readable" on public.cakes for select using (true);
create policy "Cakes manageable by baker" on public.cakes for all using (exists (select 1 from public.bakers where bakers.id = cakes.baker_id and bakers.owner_id = auth.uid()));

-- Orders
create type order_status as enum ('pending_payment', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'refunded');

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.profiles(id) on delete set null,
  baker_id text references public.bakers(id) on delete set null,
  delivery_address jsonb not null,
  scheduled_time timestamptz not null,
  total_amount numeric not null,
  currency text not null,
  status order_status not null default 'pending_payment',
  payment_intent_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;
create policy "Customers read their orders" on public.orders for select using (auth.uid() = customer_id);
create policy "Bakers read their orders" on public.orders for select using (exists (select 1 from public.bakers where bakers.id = orders.baker_id and bakers.owner_id = auth.uid()));
create policy "Admin service insert" on public.orders for insert with check (auth.role() = 'service_role');

-- Order items
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  cake_id text references public.cakes(id),
  quantity integer not null,
  unit_price numeric not null,
  notes text
);

alter table public.order_items enable row level security;
create policy "Order items follow parent" on public.order_items using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and (orders.customer_id = auth.uid() or exists (select 1 from public.bakers where bakers.id = orders.baker_id and bakers.owner_id = auth.uid())))
);

-- Order status events
create table if not exists public.order_status_events (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  status order_status not null,
  note text,
  created_at timestamptz default now()
);

alter table public.order_status_events enable row level security;
create policy "Events readable" on public.order_status_events for select using (true);

-- Ratings
create table if not exists public.ratings (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete cascade,
  baker_id text references public.bakers(id) on delete cascade,
  score integer check (score between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

alter table public.ratings enable row level security;
create policy "Ratings readable" on public.ratings for select using (true);

-- Promotions
create table if not exists public.promotions (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount_percent numeric not null,
  description text,
  max_redemptions integer,
  expires_at timestamptz,
  is_active boolean default true
);

-- Payouts
create table if not exists public.payout_requests (
  id uuid primary key default uuid_generate_v4(),
  baker_id text references public.bakers(id),
  amount numeric not null,
  currency text not null,
  destination text,
  status text default 'pending',
  created_at timestamptz default now(),
  processed_at timestamptz
);
