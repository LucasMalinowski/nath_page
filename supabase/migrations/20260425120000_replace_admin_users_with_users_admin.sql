-- Replace the admin_users lookup table with a boolean flag on public.users.
-- This keeps the admin check simple and removes the extra join/lookup from the runtime path.

alter table public.users
  add column if not exists admin boolean not null default false;

update public.users
set admin = coalesce(admin, false);

do $$
begin
  if to_regclass('public.admin_users') is not null then
    update public.users u
    set admin = true
    from public.admin_users a
    where a.id = u.id;
  end if;
end
$$;

drop policy if exists "gallery_exhibitors_admin_all" on public.gallery_exhibitors;
drop policy if exists "gallery_products_admin_all" on public.gallery_products;
drop policy if exists "portfolio_admin_all" on public.portfolio_images;
drop policy if exists "gallery_admin_delete" on storage.objects;
drop policy if exists "gallery_admin_write" on storage.objects;
drop policy if exists "portfolio_admin_delete" on storage.objects;
drop policy if exists "portfolio_admin_write" on storage.objects;

create policy "gallery_exhibitors_admin_all"
  on public.gallery_exhibitors
  as permissive
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.users
      where users.id = auth.uid()
        and users.admin is true
    )
  )
  with check (
    exists (
      select 1
      from public.users
      where users.id = auth.uid()
        and users.admin is true
    )
  );

create policy "gallery_products_admin_all"
  on public.gallery_products
  as permissive
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.users
      where users.id = auth.uid()
        and users.admin is true
    )
  )
  with check (
    exists (
      select 1
      from public.users
      where users.id = auth.uid()
        and users.admin is true
    )
  );

create policy "portfolio_admin_all"
  on public.portfolio_images
  as permissive
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.users
      where users.id = auth.uid()
        and users.admin is true
    )
  )
  with check (
    exists (
      select 1
      from public.users
      where users.id = auth.uid()
        and users.admin is true
    )
  );

create policy "gallery_admin_delete"
  on storage.objects
  as permissive
  for delete
  to authenticated
  using (
    bucket_id = 'gallery'::text
    and exists (
      select 1
      from public.users
      where users.id = auth.uid()
        and users.admin is true
    )
  );

create policy "gallery_admin_write"
  on storage.objects
  as permissive
  for insert
  to authenticated
  with check (
    bucket_id = 'gallery'::text
    and exists (
      select 1
      from public.users
      where users.id = auth.uid()
        and users.admin is true
    )
  );

create policy "portfolio_admin_delete"
  on storage.objects
  as permissive
  for delete
  to authenticated
  using (
    bucket_id = 'portfolio'::text
    and exists (
      select 1
      from public.users
      where users.id = auth.uid()
        and users.admin is true
    )
  );

create policy "portfolio_admin_write"
  on storage.objects
  as permissive
  for insert
  to authenticated
  with check (
    bucket_id = 'portfolio'::text
    and exists (
      select 1
      from public.users
      where users.id = auth.uid()
        and users.admin is true
    )
  );

drop table if exists public.admin_users;
