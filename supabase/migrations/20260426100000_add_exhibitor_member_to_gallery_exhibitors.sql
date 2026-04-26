alter table public.gallery_exhibitors
add column if not exists exhibitor_member boolean not null default false;
