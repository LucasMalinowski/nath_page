create table if not exists public.portfolio_images (
                                                       id uuid primary key default gen_random_uuid(),
    title varchar not null,
    description text,
    image_url text not null,
    display_order integer default 0,
    is_visible boolean default true,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp,
                             images text[] default array[]::text[]
                             );