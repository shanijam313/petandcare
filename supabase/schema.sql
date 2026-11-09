-- Supabase schema for Modern Pet Care & Stylish Fish Palace
-- Paste this whole file into Supabase SQL Editor and run it once.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  image text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  category_name text not null,
  price numeric(12,2) not null default 0,
  sale_price numeric(12,2),
  images text[] not null default '{}',
  description text not null default '',
  features text[] not null default '{}',
  specifications jsonb not null default '{}'::jsonb,
  stock integer not null default 0,
  sku text not null unique,
  brand text not null default '',
  rating numeric(3,2) not null default 0,
  reviews integer not null default 0,
  badge text check (badge in ('Sale', 'New Arrival', 'Best Seller')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_is_active_idx on public.products(is_active);
create index if not exists products_sku_idx on public.products(sku);

create table if not exists public.orders (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  customer_name text not null,
  email text not null,
  phone text not null,
  whatsapp text not null,
  street_address text not null,
  area text not null,
  landmark text,
  city text not null,
  postal_code text not null,
  order_note text,
  coupon_code text,
  subtotal numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  shipping numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_method text not null check (payment_method in ('online', 'cod')),
  status text not null default 'Pending' check (status in ('Pending', 'Accepted', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Rejected')),
  user_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_email_idx on public.orders(email);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  name text not null,
  price numeric(12,2) not null default 0,
  sale_price numeric(12,2),
  quantity integer not null default 1,
  image text,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists order_items_product_id_idx on public.order_items(product_id);

create table if not exists public.coupons (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  code text not null unique,
  type text not null check (type in ('percent', 'fixed')),
  value numeric(12,2) not null default 0,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists coupons_code_idx on public.coupons(code);
create index if not exists coupons_active_idx on public.coupons(active);

create table if not exists public.store_settings (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  session_id text not null,
  product_id text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (session_id, product_id)
);

create index if not exists wishlist_user_id_idx on public.wishlist(user_id);
create index if not exists wishlist_session_id_idx on public.wishlist(session_id);

create table if not exists public.cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  session_id text not null,
  product_id text not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, product_id)
);

create index if not exists cart_user_id_idx on public.cart(user_id);
create index if not exists cart_session_id_idx on public.cart(session_id);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reviews_product_id_idx on public.reviews(product_id);
create index if not exists reviews_approved_idx on public.reviews(approved);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if to_regclass('public.profiles') is not null then
    execute 'drop trigger if exists set_profiles_updated_at on public.profiles';
    execute 'create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at()';
  end if;

  if to_regclass('public.categories') is not null then
    execute 'drop trigger if exists set_categories_updated_at on public.categories';
    execute 'create trigger set_categories_updated_at before update on public.categories for each row execute function public.set_updated_at()';
  end if;

  if to_regclass('public.products') is not null then
    execute 'drop trigger if exists set_products_updated_at on public.products';
    execute 'create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at()';
  end if;

  if to_regclass('public.orders') is not null then
    execute 'drop trigger if exists set_orders_updated_at on public.orders';
    execute 'create trigger set_orders_updated_at before update on public.orders for each row execute function public.set_updated_at()';
  end if;

  if to_regclass('public.coupons') is not null then
    execute 'drop trigger if exists set_coupons_updated_at on public.coupons';
    execute 'create trigger set_coupons_updated_at before update on public.coupons for each row execute function public.set_updated_at()';
  end if;

  if to_regclass('public.cart') is not null then
    execute 'drop trigger if exists set_cart_updated_at on public.cart';
    execute 'create trigger set_cart_updated_at before update on public.cart for each row execute function public.set_updated_at()';
  end if;

  if to_regclass('public.reviews') is not null then
    execute 'drop trigger if exists set_reviews_updated_at on public.reviews';
    execute 'create trigger set_reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at()';
  end if;
end
$$;

alter table if exists public.profiles enable row level security;
alter table if exists public.categories enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.orders enable row level security;
alter table if exists public.order_items enable row level security;
alter table if exists public.coupons enable row level security;
alter table if exists public.store_settings enable row level security;
alter table if exists public.wishlist enable row level security;
alter table if exists public.cart enable row level security;
alter table if exists public.reviews enable row level security;

create policy "Public read categories" on public.categories
for select using (true);

create policy "Public read active products" on public.products
for select using (is_active = true);

create policy "Admins manage products" on public.products
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Admins manage categories" on public.categories
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Admins read orders" on public.orders
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Admins update orders" on public.orders
for update using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Admins delete orders" on public.orders
for delete using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Customers insert orders" on public.orders
for insert with check (true);

create policy "Customers read own orders" on public.orders
for select using (
  auth.uid() is not null and (user_id = auth.uid() or email = coalesce((select email from public.profiles where id = auth.uid()), email))
);

create policy "Admins read order items" on public.order_items
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Admins delete order items" on public.order_items
for delete using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Order items insert with order" on public.order_items
for insert with check (true);

create policy "Admins manage coupons" on public.coupons
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Public read store settings" on public.store_settings
for select using (true);

create policy "Admins manage store settings" on public.store_settings
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Customers manage wishlist" on public.wishlist
for all using (auth.uid() is null or user_id = auth.uid() or user_id is null) with check (true);

create policy "Customers manage cart" on public.cart
for all using (auth.uid() is null or user_id = auth.uid() or user_id is null) with check (true);

create policy "Public read approved reviews" on public.reviews
for select using (approved = true);

create policy "Customers insert reviews" on public.reviews
for insert with check (true);

create policy "Admins moderate reviews" on public.reviews
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
) with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'product'
  ) then
    insert into storage.buckets (id, name, public)
    values ('product', 'product', true);
  end if;
end
$$;

insert into public.categories (id, name, slug, image, sort_order)
values
  (gen_random_uuid(), 'Cat Food', 'cat-food', '/images/meomix-500.png', 1),
  (gen_random_uuid(), 'Cat Accessories', 'cat-accessories', '/images/cat-house-bed.png', 2),
  (gen_random_uuid(), 'Dog Food', 'dog-food', '/images/dog-food-bigpaw-20kg.png', 3),
  (gen_random_uuid(), 'Dog Accessories', 'dog-accessories', '/images/dog-accessories.png', 4),
  (gen_random_uuid(), 'Cat Medicine', 'cat-medicine', '/images/cat-medicine.png', 5),
  (gen_random_uuid(), 'Dog Medicine', 'dog-medicine', '/images/dog-medicine.png', 6),
  (gen_random_uuid(), 'Aquariums', 'aquariums', '/images/aquarium.png', 7),
  (gen_random_uuid(), 'Fish', 'fish', '/images/fish.png', 8)
on conflict (slug) do update
set name = excluded.name,
    image = excluded.image,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.products (
  id, name, category_name, price, sale_price, images, description, features, specifications,
  stock, sku, brand, rating, reviews, badge, is_active
) values
  (
    'p1',
    'Pawfect Adult Cat Food 1kg',
    'Cat Food',
    1100,
    null,
    array['/images/pawfect-adult.jpeg'],
    'Complete and balanced nutrition for adult cats with premium protein support.',
    array['Complete balanced nutrition', 'Premium protein', 'Daily feeding'],
    '{"Weight":"1kg","Brand":"Pawfect","Type":"Adult Cat Food"}'::jsonb,
    20,
    'PF-ADULT-1KG',
    'Pawfect',
    4.8,
    12,
    'Best Seller',
    true
  )
on conflict (id) do update set name = excluded.name;
