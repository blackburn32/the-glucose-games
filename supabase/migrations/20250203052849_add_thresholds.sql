create table "public"."thresholds" (
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "low" smallint not null,
    "high" smallint not null,
    "user_id" uuid not null
);


alter table "public"."thresholds" enable row level security;

CREATE UNIQUE INDEX thresholds_pkey ON public.thresholds USING btree (user_id);

CREATE UNIQUE INDEX thresholds_user_id_key ON public.thresholds USING btree (user_id);

alter table "public"."thresholds" add constraint "thresholds_pkey" PRIMARY KEY using index "thresholds_pkey";

alter table "public"."thresholds" add constraint "public_thresholds_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."thresholds" validate constraint "public_thresholds_user_id_fkey";

alter table "public"."thresholds" add constraint "thresholds_user_id_key" UNIQUE using index "thresholds_user_id_key";

grant delete on table "public"."thresholds" to "anon";

grant insert on table "public"."thresholds" to "anon";

grant references on table "public"."thresholds" to "anon";

grant select on table "public"."thresholds" to "anon";

grant trigger on table "public"."thresholds" to "anon";

grant truncate on table "public"."thresholds" to "anon";

grant update on table "public"."thresholds" to "anon";

grant delete on table "public"."thresholds" to "authenticated";

grant insert on table "public"."thresholds" to "authenticated";

grant references on table "public"."thresholds" to "authenticated";

grant select on table "public"."thresholds" to "authenticated";

grant trigger on table "public"."thresholds" to "authenticated";

grant truncate on table "public"."thresholds" to "authenticated";

grant update on table "public"."thresholds" to "authenticated";

grant delete on table "public"."thresholds" to "service_role";

grant insert on table "public"."thresholds" to "service_role";

grant references on table "public"."thresholds" to "service_role";

grant select on table "public"."thresholds" to "service_role";

grant trigger on table "public"."thresholds" to "service_role";

grant truncate on table "public"."thresholds" to "service_role";

grant update on table "public"."thresholds" to "service_role";

create policy "Users can insert their own thresholds"
on "public"."thresholds"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can select their own thresholds"
on "public"."thresholds"
as permissive
for select
  to public
  using ((auth.uid() = user_id));


create policy "Users can update their own thresholds"
on "public"."thresholds"
as permissive
for update
   to public
   using ((auth.uid() = user_id));
