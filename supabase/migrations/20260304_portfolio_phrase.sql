alter table if exists public.portfolio_images
  add column if not exists phrase text;
