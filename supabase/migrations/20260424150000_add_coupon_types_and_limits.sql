alter table public.coupons
  add column if not exists discount_type text not null default 'percentage',
  add column if not exists discount_value_cents integer,
  add column if not exists max_uses integer,
  add column if not exists uses_count integer not null default 0,
  add column if not exists updated_at timestamp with time zone default now();

alter table public.coupons
  drop constraint if exists coupons_discount_type_check;

alter table public.coupons
  add constraint coupons_discount_type_check
  check (discount_type in ('percentage', 'fixed'));

alter table public.coupons
  drop constraint if exists coupons_discount_payload_check;

alter table public.coupons
  add constraint coupons_discount_payload_check
  check (
    (
      discount_type = 'percentage'
      and discount_percent is not null
      and discount_percent > 0
      and discount_percent <= 100
      and discount_value_cents is null
    )
    or (
      discount_type = 'fixed'
      and discount_value_cents is not null
      and discount_value_cents > 0
    )
  );

alter table public.coupons
  drop constraint if exists coupons_max_uses_check;

alter table public.coupons
  add constraint coupons_max_uses_check
  check (max_uses is null or max_uses > 0);

alter table public.coupons
  drop constraint if exists coupons_uses_count_check;

alter table public.coupons
  add constraint coupons_uses_count_check
  check (uses_count >= 0);

alter table public.coupons
  drop constraint if exists coupons_usage_limit_check;

alter table public.coupons
  add constraint coupons_usage_limit_check
  check (max_uses is null or uses_count <= max_uses);

create index if not exists coupons_active_expires_idx
  on public.coupons (is_active, expires_at);

create or replace function public.consume_coupon_use(p_code text)
returns public.coupons
language plpgsql
security definer
set search_path = public
as $$
declare
  coupon_row public.coupons;
begin
  if trim(coalesce(p_code, '')) = '' then
    raise exception 'Coupon code is required';
  end if;

  select *
    into coupon_row
    from public.coupons
   where upper(code) = upper(trim(p_code))
   for update;

  if not found then
    raise exception 'Invalid or expired coupon';
  end if;

  if not coupon_row.is_active then
    raise exception 'Invalid or expired coupon';
  end if;

  if coupon_row.expires_at is not null and coupon_row.expires_at <= now() then
    raise exception 'Invalid or expired coupon';
  end if;

  if coupon_row.max_uses is not null and coupon_row.uses_count >= coupon_row.max_uses then
    raise exception 'Coupon usage limit reached';
  end if;

  update public.coupons
     set uses_count = uses_count + 1,
         updated_at = now()
   where id = coupon_row.id
   returning *
    into coupon_row;

  return coupon_row;
end;
$$;
