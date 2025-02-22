create table "public"."nightscout_settings" (
                                                "created_at" timestamp with time zone not null default now(),
                                                "updated_at" timestamp with time zone not null default now(),
                                                "user_id" uuid not null,
                                                "base_url" text not null,
                                                "token" text not null
);


alter table "public"."nightscout_settings" enable row level security;

CREATE UNIQUE INDEX nightscout_settings_pkey ON public.nightscout_settings USING btree (user_id);

alter table "public"."nightscout_settings" add constraint "nightscout_settings_pkey" PRIMARY KEY using index "nightscout_settings_pkey";

alter table "public"."nightscout_settings" add constraint "public_nightscout_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."nightscout_settings" validate constraint "public_nightscout_settings_user_id_fkey";

grant delete on table "public"."nightscout_settings" to "anon";

grant insert on table "public"."nightscout_settings" to "anon";

grant references on table "public"."nightscout_settings" to "anon";

grant select on table "public"."nightscout_settings" to "anon";

grant trigger on table "public"."nightscout_settings" to "anon";

grant truncate on table "public"."nightscout_settings" to "anon";

grant update on table "public"."nightscout_settings" to "anon";

grant delete on table "public"."nightscout_settings" to "authenticated";

grant insert on table "public"."nightscout_settings" to "authenticated";

grant references on table "public"."nightscout_settings" to "authenticated";

grant select on table "public"."nightscout_settings" to "authenticated";

grant trigger on table "public"."nightscout_settings" to "authenticated";

grant truncate on table "public"."nightscout_settings" to "authenticated";

grant update on table "public"."nightscout_settings" to "authenticated";

grant delete on table "public"."nightscout_settings" to "service_role";

grant insert on table "public"."nightscout_settings" to "service_role";

grant references on table "public"."nightscout_settings" to "service_role";

grant select on table "public"."nightscout_settings" to "service_role";

grant trigger on table "public"."nightscout_settings" to "service_role";

grant truncate on table "public"."nightscout_settings" to "service_role";

grant update on table "public"."nightscout_settings" to "service_role";

create policy "Users can manage their own Nightscout settings"
on "public"."nightscout_settings"
as permissive
for all
to public
using ((auth.uid() = user_id));
