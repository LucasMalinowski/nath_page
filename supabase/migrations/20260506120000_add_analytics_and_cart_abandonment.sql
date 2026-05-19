alter table public.cart_items
  add column if not exists updated_at timestamp with time zone default now();

create or replace function public.set_cart_item_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_cart_item_updated_at on public.cart_items;
create trigger set_cart_item_updated_at
  before update on public.cart_items
  for each row execute procedure public.set_cart_item_updated_at();

create table if not exists public.cart_abandonment_notifications (
  user_id uuid primary key references auth.users(id) on delete cascade,
  notified_cart_updated_at timestamp with time zone not null,
  notified_at timestamp with time zone not null default now(),
  cart_snapshot jsonb
);

create index if not exists cart_items_user_updated_at_idx
  on public.cart_items(user_id, updated_at);

alter table public.cart_abandonment_notifications enable row level security;

drop policy if exists "Admins can read cart abandonment notifications" on public.cart_abandonment_notifications;
create policy "Admins can read cart abandonment notifications"
  on public.cart_abandonment_notifications for select
  to authenticated
  using (
    exists (
      select 1
      from public.users
      where users.id = auth.uid()
        and users.admin is true
    )
  );
