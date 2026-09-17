-- CUTNEST SUPABASE DATABASE
-- Run this entire file in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric(10,2) not null check (price >= 0),
  image text,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  total numeric(10,2) not null,
  status text default 'Placed',
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid,
  product_name text not null,
  price numeric(10,2) not null,
  quantity integer not null check (quantity > 0)
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products for select using (true);

drop policy if exists "orders_public_insert" on public.orders;
create policy "orders_public_insert" on public.orders for insert with check (true);

drop policy if exists "order_items_public_insert" on public.order_items;
create policy "order_items_public_insert" on public.order_items for insert with check (true);

insert into public.products (name,category,price,image)
select * from (values
('Tree Wall Art','Wall Art',299,''),
('Geometric Deer','Home Decor',399,''),
('Table Organizer','Organizers',449,''),
('Photo Frame','Home Decor',249,''),
('Eiffel Tower Model','Models',399,''),
('Happy Birthday Topper','Gifts',199,''),
('Pen Holder','Office',199,''),
('Cat Silhouette','Wall Art',349,''),
('Wall Clock','Home Decor',599,''),
('House Model','Models',499,''),
('Butterfly Wall Art','Wall Art',299,''),
('Plant Stand','Home Decor',299,''),
('Key Holder','Organizers',279,''),
('Car Model','Models',449,''),
('Mandala Art','Wall Art',349,'')
) as v(name,category,price,image)
where not exists (select 1 from public.products);
