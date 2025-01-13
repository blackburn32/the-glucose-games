create table "public"."oauth_tokens" (
    "created_at" timestamp with time zone not null default now(),
    "provider" text not null,
    "user_id" uuid not null default gen_random_uuid(),
    "id" uuid not null default gen_random_uuid(),
    "scopes" text[] not null,
    "access_token" text not null,
    "refresh_token" text not null,
    "expires_at" timestamp with time zone not null
);


alter table "public"."oauth_tokens" enable row level security;

CREATE UNIQUE INDEX oauth_tokens_pkey ON public.oauth_tokens USING btree (id);

alter table "public"."oauth_tokens" add constraint "oauth_tokens_pkey" PRIMARY KEY using index "oauth_tokens_pkey";

alter table "public"."oauth_tokens" add constraint "public_oauth_tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."oauth_tokens" validate constraint "public_oauth_tokens_user_id_fkey";

grant delete on table "public"."oauth_tokens" to "anon";

grant insert on table "public"."oauth_tokens" to "anon";

grant references on table "public"."oauth_tokens" to "anon";

grant select on table "public"."oauth_tokens" to "anon";

grant trigger on table "public"."oauth_tokens" to "anon";

grant truncate on table "public"."oauth_tokens" to "anon";

grant update on table "public"."oauth_tokens" to "anon";

grant delete on table "public"."oauth_tokens" to "authenticated";

grant insert on table "public"."oauth_tokens" to "authenticated";

grant references on table "public"."oauth_tokens" to "authenticated";

grant select on table "public"."oauth_tokens" to "authenticated";

grant trigger on table "public"."oauth_tokens" to "authenticated";

grant truncate on table "public"."oauth_tokens" to "authenticated";

grant update on table "public"."oauth_tokens" to "authenticated";

grant delete on table "public"."oauth_tokens" to "service_role";

grant insert on table "public"."oauth_tokens" to "service_role";

grant references on table "public"."oauth_tokens" to "service_role";

grant select on table "public"."oauth_tokens" to "service_role";

grant trigger on table "public"."oauth_tokens" to "service_role";

grant truncate on table "public"."oauth_tokens" to "service_role";

grant update on table "public"."oauth_tokens" to "service_role";

create policy "Users can delete their own tokens"
on "public"."oauth_tokens"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can see existence of their own tokens"
on "public"."oauth_tokens"
as permissive
for select
to public
using ((auth.uid() = user_id));
