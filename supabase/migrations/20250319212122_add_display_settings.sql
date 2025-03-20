create table "public"."display_settings" (
 "created_at" timestamp with time zone not null default now(),
 "updated_at" timestamp with time zone not null default now(),
 "use_mmol" boolean not null default false,
 "user_id" uuid not null default gen_random_uuid()
);


alter table "public"."display_settings" enable row level security;

CREATE UNIQUE INDEX display_settings_pkey ON public.display_settings USING btree (user_id);

alter table "public"."display_settings" add constraint "display_settings_pkey" PRIMARY KEY using index "display_settings_pkey";

alter table "public"."display_settings" add constraint "public_display_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."display_settings" validate constraint "public_display_settings_user_id_fkey";

grant delete on table "public"."display_settings" to "anon";

grant insert on table "public"."display_settings" to "anon";

grant references on table "public"."display_settings" to "anon";

grant select on table "public"."display_settings" to "anon";

grant trigger on table "public"."display_settings" to "anon";

grant truncate on table "public"."display_settings" to "anon";

grant update on table "public"."display_settings" to "anon";

grant delete on table "public"."display_settings" to "authenticated";

grant insert on table "public"."display_settings" to "authenticated";

grant references on table "public"."display_settings" to "authenticated";

grant select on table "public"."display_settings" to "authenticated";

grant trigger on table "public"."display_settings" to "authenticated";

grant truncate on table "public"."display_settings" to "authenticated";

grant update on table "public"."display_settings" to "authenticated";

grant delete on table "public"."display_settings" to "service_role";

grant insert on table "public"."display_settings" to "service_role";

grant references on table "public"."display_settings" to "service_role";

grant select on table "public"."display_settings" to "service_role";

grant trigger on table "public"."display_settings" to "service_role";

grant truncate on table "public"."display_settings" to "service_role";

grant update on table "public"."display_settings" to "service_role";

create policy "Users can manage their own display settings"
on "public"."display_settings"
as permissive
for all
to public
using ((auth.uid() = user_id));
