alter table public.gallery_products
  add column if not exists package_weight_grams integer,
  add column if not exists package_height_cm numeric(10, 2),
  add column if not exists package_width_cm numeric(10, 2),
  add column if not exists package_length_cm numeric(10, 2);

alter table public.users
  add column if not exists document text,
  add column if not exists address_number text,
  add column if not exists district text;

alter table public.orders
  add column if not exists shipping_cents integer not null default 0 check (shipping_cents >= 0),
  add column if not exists shipping_service_code integer,
  add column if not exists shipping_service_name text,
  add column if not exists shipping_delivery_days integer,
  add column if not exists shipping_quote_data jsonb,
  add column if not exists shipping_package_data jsonb,
  add column if not exists shipping_address_data jsonb,
  add column if not exists shipping_status text,
  add column if not exists shipping_tracking_code text,
  add column if not exists shipping_tracking_url text,
  add column if not exists shipping_label_url text,
  add column if not exists shipping_error_message text,
  add column if not exists superfrete_order_id text,
  add column if not exists superfrete_checkout_data jsonb,
  add column if not exists superfrete_order_data jsonb;

create index if not exists orders_superfrete_order_id_idx on public.orders(superfrete_order_id)
  where superfrete_order_id is not null;
