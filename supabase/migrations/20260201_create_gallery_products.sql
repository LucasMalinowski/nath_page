create table if not exists public.gallery_products (
                                                       id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    price_cents integer not null,
    image_url text,
    created_at timestamp with time zone default now()
    );