alter table public.gallery_products
  add column if not exists image_blank_side text not null default 'right'
    check (image_blank_side in ('left', 'right'));
