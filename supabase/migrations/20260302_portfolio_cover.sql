alter table if exists public.portfolio_images
  add column if not exists cover_url text;

update public.portfolio_images
set cover_url = image_url
where cover_url is null;
