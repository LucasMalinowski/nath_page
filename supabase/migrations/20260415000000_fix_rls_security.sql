-- ============================================================
-- Security hardening: fix overly permissive RLS policies
-- ============================================================

-- 1. Enable RLS on admin_users (was missing - anyone could insert themselves as admin)
alter table "public"."admin_users" enable row level security;

-- Allow authenticated users to check if they are in admin_users (needed by existing admin_all policies)
create policy "admin_users_self_select"
  on "public"."admin_users"
  as permissive
  for select
  to authenticated
  using (true);
-- Note: INSERT/UPDATE/DELETE on admin_users must be done via service_role (server-side only).
-- service_role bypasses RLS, so no write policies are needed here.

-- 2. Drop overly permissive gallery_products write policies
-- These allowed ANY authenticated user to insert/update/delete products.
-- The correct admin-only policy (gallery_products_admin_all) already exists.
drop policy if exists "gallery_products_authenticated_delete" on "public"."gallery_products";
drop policy if exists "gallery_products_authenticated_insert" on "public"."gallery_products";
drop policy if exists "gallery_products_authenticated_update" on "public"."gallery_products";

-- 3. Drop overly permissive gallery_exhibitors write policies
drop policy if exists "gallery_exhibitors_authenticated_delete" on "public"."gallery_exhibitors";
drop policy if exists "gallery_exhibitors_authenticated_insert" on "public"."gallery_exhibitors";
drop policy if exists "gallery_exhibitors_authenticated_update" on "public"."gallery_exhibitors";

-- 4. Drop overly permissive portfolio_images policies
-- Public write (anon) is dangerous - anyone could corrupt the portfolio
drop policy if exists "Allow public delete" on "public"."portfolio_images";
drop policy if exists "Allow public insert" on "public"."portfolio_images";
drop policy if exists "Allow public update" on "public"."portfolio_images";
-- Any authenticated user write is also too broad
drop policy if exists "Authenticated users can delete images" on "public"."portfolio_images";
drop policy if exists "Authenticated users can insert images" on "public"."portfolio_images";
drop policy if exists "Authenticated users can update images" on "public"."portfolio_images";
-- Duplicate select policies - keep only the is_visible=true ones
drop policy if exists "Public can view all portfolio images" on "public"."portfolio_images";
-- portfolio_admin_all and portfolio_select_public remain (correct)

-- 5. Enable RLS on keepalive (accessed only via service_role from cron endpoints)
alter table "public"."keepalive" enable row level security;
-- No explicit policies needed: service_role bypasses RLS automatically.
-- This prevents anon/authenticated from reading or writing cron state.

-- 6. Drop public write access on storage.objects for the portfolio bucket
-- Anyone could upload arbitrary files to the portfolio
drop policy if exists "Allow Delete" on "storage"."objects";
drop policy if exists "Allow Upload" on "storage"."objects";
-- portfolio_admin_write and portfolio_admin_delete (admin-only) already exist and remain.
-- portfolio_public_read remains for viewing images.

-- 7. Drop overly permissive gallery storage write policies
-- gallery_admin_write and gallery_admin_delete (admin-only) already exist.
drop policy if exists "gallery_objects_authenticated_delete" on "storage"."objects";
drop policy if exists "gallery_objects_authenticated_insert" on "storage"."objects";
drop policy if exists "gallery_objects_authenticated_update" on "storage"."objects";
-- gallery_objects_public_read and gallery_public_read remain for viewing.

-- 8. Atomic stock deduction function (prevents race condition in webhook)
create or replace function public.deduct_product_stock(p_product_id uuid, p_quantity integer)
returns void
language sql
security definer
set search_path = public
as $$
  update public.gallery_products
  set quantity = greatest(0, quantity - p_quantity)
  where id = p_product_id;
$$;
