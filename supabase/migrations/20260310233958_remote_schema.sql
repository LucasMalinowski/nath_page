drop extension if exists "pg_net";


  create table "public"."admin_users" (
    "id" uuid not null,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."gallery_exhibitors" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "title" text,
    "instagram_path" text,
    "avatar_url" text,
    "display_order" integer default 0,
    "is_visible" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."gallery_exhibitors" enable row level security;


  create table "public"."keepalive" (
    "id" text not null,
    "last_ping" timestamp with time zone not null default now()
      );


alter table "public"."gallery_products" drop column "image_url";

alter table "public"."gallery_products" drop column "price_cents";

alter table "public"."gallery_products" drop column "title";

alter table "public"."gallery_products" add column "author" text;

alter table "public"."gallery_products" add column "display_order" integer default 0;

alter table "public"."gallery_products" add column "images" jsonb not null default '[]'::jsonb;

alter table "public"."gallery_products" add column "is_visible" boolean default true;

alter table "public"."gallery_products" add column "name" text not null;

alter table "public"."gallery_products" add column "price_text" text;

alter table "public"."gallery_products" add column "quantity" integer;

alter table "public"."gallery_products" add column "updated_at" timestamp with time zone default now();

alter table "public"."gallery_products" enable row level security;

alter table "public"."portfolio_images" alter column "title" set data type character varying(255) using "title"::character varying(255);

alter table "public"."portfolio_images" enable row level security;

CREATE UNIQUE INDEX admin_users_pkey ON public.admin_users USING btree (id);

CREATE UNIQUE INDEX gallery_exhibitors_pkey ON public.gallery_exhibitors USING btree (id);

CREATE INDEX idx_portfolio_images_array ON public.portfolio_images USING gin (images);

CREATE INDEX idx_portfolio_images_order ON public.portfolio_images USING btree (display_order);

CREATE INDEX idx_portfolio_images_visible ON public.portfolio_images USING btree (is_visible);

CREATE UNIQUE INDEX keepalive_pkey ON public.keepalive USING btree (id);

alter table "public"."admin_users" add constraint "admin_users_pkey" PRIMARY KEY using index "admin_users_pkey";

alter table "public"."gallery_exhibitors" add constraint "gallery_exhibitors_pkey" PRIMARY KEY using index "gallery_exhibitors_pkey";

alter table "public"."keepalive" add constraint "keepalive_pkey" PRIMARY KEY using index "keepalive_pkey";

alter table "public"."admin_users" add constraint "admin_users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."admin_users" validate constraint "admin_users_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
  begin
    new.updated_at = now();
    return new;
  end;
  $function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."admin_users" to "anon";

grant insert on table "public"."admin_users" to "anon";

grant references on table "public"."admin_users" to "anon";

grant select on table "public"."admin_users" to "anon";

grant trigger on table "public"."admin_users" to "anon";

grant truncate on table "public"."admin_users" to "anon";

grant update on table "public"."admin_users" to "anon";

grant delete on table "public"."admin_users" to "authenticated";

grant insert on table "public"."admin_users" to "authenticated";

grant references on table "public"."admin_users" to "authenticated";

grant select on table "public"."admin_users" to "authenticated";

grant trigger on table "public"."admin_users" to "authenticated";

grant truncate on table "public"."admin_users" to "authenticated";

grant update on table "public"."admin_users" to "authenticated";

grant delete on table "public"."admin_users" to "service_role";

grant insert on table "public"."admin_users" to "service_role";

grant references on table "public"."admin_users" to "service_role";

grant select on table "public"."admin_users" to "service_role";

grant trigger on table "public"."admin_users" to "service_role";

grant truncate on table "public"."admin_users" to "service_role";

grant update on table "public"."admin_users" to "service_role";

grant delete on table "public"."gallery_exhibitors" to "anon";

grant insert on table "public"."gallery_exhibitors" to "anon";

grant references on table "public"."gallery_exhibitors" to "anon";

grant select on table "public"."gallery_exhibitors" to "anon";

grant trigger on table "public"."gallery_exhibitors" to "anon";

grant truncate on table "public"."gallery_exhibitors" to "anon";

grant update on table "public"."gallery_exhibitors" to "anon";

grant delete on table "public"."gallery_exhibitors" to "authenticated";

grant insert on table "public"."gallery_exhibitors" to "authenticated";

grant references on table "public"."gallery_exhibitors" to "authenticated";

grant select on table "public"."gallery_exhibitors" to "authenticated";

grant trigger on table "public"."gallery_exhibitors" to "authenticated";

grant truncate on table "public"."gallery_exhibitors" to "authenticated";

grant update on table "public"."gallery_exhibitors" to "authenticated";

grant delete on table "public"."gallery_exhibitors" to "service_role";

grant insert on table "public"."gallery_exhibitors" to "service_role";

grant references on table "public"."gallery_exhibitors" to "service_role";

grant select on table "public"."gallery_exhibitors" to "service_role";

grant trigger on table "public"."gallery_exhibitors" to "service_role";

grant truncate on table "public"."gallery_exhibitors" to "service_role";

grant update on table "public"."gallery_exhibitors" to "service_role";

grant delete on table "public"."keepalive" to "anon";

grant insert on table "public"."keepalive" to "anon";

grant references on table "public"."keepalive" to "anon";

grant select on table "public"."keepalive" to "anon";

grant trigger on table "public"."keepalive" to "anon";

grant truncate on table "public"."keepalive" to "anon";

grant update on table "public"."keepalive" to "anon";

grant delete on table "public"."keepalive" to "authenticated";

grant insert on table "public"."keepalive" to "authenticated";

grant references on table "public"."keepalive" to "authenticated";

grant select on table "public"."keepalive" to "authenticated";

grant trigger on table "public"."keepalive" to "authenticated";

grant truncate on table "public"."keepalive" to "authenticated";

grant update on table "public"."keepalive" to "authenticated";

grant delete on table "public"."keepalive" to "service_role";

grant insert on table "public"."keepalive" to "service_role";

grant references on table "public"."keepalive" to "service_role";

grant select on table "public"."keepalive" to "service_role";

grant trigger on table "public"."keepalive" to "service_role";

grant truncate on table "public"."keepalive" to "service_role";

grant update on table "public"."keepalive" to "service_role";


  create policy "gallery_exhibitors_admin_all"
  on "public"."gallery_exhibitors"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.id = auth.uid()))))
with check ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.id = auth.uid()))));



  create policy "gallery_exhibitors_authenticated_delete"
  on "public"."gallery_exhibitors"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "gallery_exhibitors_authenticated_insert"
  on "public"."gallery_exhibitors"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "gallery_exhibitors_authenticated_update"
  on "public"."gallery_exhibitors"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "gallery_exhibitors_select_public"
  on "public"."gallery_exhibitors"
  as permissive
  for select
  to public
using ((is_visible = true));



  create policy "gallery_products_admin_all"
  on "public"."gallery_products"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.id = auth.uid()))))
with check ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.id = auth.uid()))));



  create policy "gallery_products_authenticated_delete"
  on "public"."gallery_products"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "gallery_products_authenticated_insert"
  on "public"."gallery_products"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "gallery_products_authenticated_update"
  on "public"."gallery_products"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "gallery_products_select_public"
  on "public"."gallery_products"
  as permissive
  for select
  to public
using ((is_visible = true));



  create policy "Allow public delete"
  on "public"."portfolio_images"
  as permissive
  for delete
  to public
using (true);



  create policy "Allow public insert"
  on "public"."portfolio_images"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public update"
  on "public"."portfolio_images"
  as permissive
  for update
  to public
using (true)
with check (true);



  create policy "Authenticated users can delete images"
  on "public"."portfolio_images"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Authenticated users can insert images"
  on "public"."portfolio_images"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Authenticated users can update images"
  on "public"."portfolio_images"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Public can view all portfolio images"
  on "public"."portfolio_images"
  as permissive
  for select
  to public
using (true);



  create policy "Public can view visible images"
  on "public"."portfolio_images"
  as permissive
  for select
  to public
using ((is_visible = true));



  create policy "portfolio_admin_all"
  on "public"."portfolio_images"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.id = auth.uid()))))
with check ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.id = auth.uid()))));



  create policy "portfolio_select_public"
  on "public"."portfolio_images"
  as permissive
  for select
  to public
using ((is_visible = true));


CREATE TRIGGER gallery_exhibitors_updated_at BEFORE UPDATE ON public.gallery_exhibitors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER gallery_products_updated_at BEFORE UPDATE ON public.gallery_products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_portfolio_images_updated_at BEFORE UPDATE ON public.portfolio_images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


  create policy "Allow Delete"
  on "storage"."objects"
  as permissive
  for delete
  to public
using ((bucket_id = 'portfolio'::text));



  create policy "Allow Upload"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'portfolio'::text));



  create policy "Public can view portfolio images"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'portfolio'::text));



  create policy "gallery_admin_delete"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'gallery'::text) AND (EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.id = auth.uid())))));



  create policy "gallery_admin_write"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'gallery'::text) AND (EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.id = auth.uid())))));



  create policy "gallery_objects_authenticated_delete"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'gallery'::text));



  create policy "gallery_objects_authenticated_insert"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'gallery'::text));



  create policy "gallery_objects_authenticated_update"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'gallery'::text))
with check ((bucket_id = 'gallery'::text));



  create policy "gallery_objects_public_read"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'gallery'::text));



  create policy "gallery_public_read"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'gallery'::text));



  create policy "portfolio_admin_delete"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'portfolio'::text) AND (EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.id = auth.uid())))));



  create policy "portfolio_admin_write"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'portfolio'::text) AND (EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.id = auth.uid())))));



  create policy "portfolio_public_read"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'portfolio'::text));



