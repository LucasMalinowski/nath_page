-- Allow portfolio items to exist with only the cover image.
alter table if exists public.portfolio_images
  alter column images drop not null;
