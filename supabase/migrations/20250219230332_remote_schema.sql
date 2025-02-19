drop policy "Allow auth admin to read user roles" on "public"."user_roles";

drop policy "Allow individual read access" on "public"."user_roles";

revoke delete on table "public"."oauth_tokens" from "anon";

revoke insert on table "public"."oauth_tokens" from "anon";

revoke select on table "public"."oauth_tokens" from "anon";

revoke update on table "public"."oauth_tokens" from "anon";

revoke insert on table "public"."oauth_tokens" from "authenticated";

revoke update on table "public"."oauth_tokens" from "authenticated";

revoke delete on table "public"."role_permissions" from "anon";

revoke insert on table "public"."role_permissions" from "anon";

revoke references on table "public"."role_permissions" from "anon";

revoke select on table "public"."role_permissions" from "anon";

revoke trigger on table "public"."role_permissions" from "anon";

revoke truncate on table "public"."role_permissions" from "anon";

revoke update on table "public"."role_permissions" from "anon";

revoke delete on table "public"."role_permissions" from "authenticated";

revoke insert on table "public"."role_permissions" from "authenticated";

revoke references on table "public"."role_permissions" from "authenticated";

revoke select on table "public"."role_permissions" from "authenticated";

revoke trigger on table "public"."role_permissions" from "authenticated";

revoke truncate on table "public"."role_permissions" from "authenticated";

revoke update on table "public"."role_permissions" from "authenticated";

revoke delete on table "public"."role_permissions" from "service_role";

revoke insert on table "public"."role_permissions" from "service_role";

revoke references on table "public"."role_permissions" from "service_role";

revoke select on table "public"."role_permissions" from "service_role";

revoke trigger on table "public"."role_permissions" from "service_role";

revoke truncate on table "public"."role_permissions" from "service_role";

revoke update on table "public"."role_permissions" from "service_role";

revoke delete on table "public"."user_roles" from "anon";

revoke insert on table "public"."user_roles" from "anon";

revoke references on table "public"."user_roles" from "anon";

revoke select on table "public"."user_roles" from "anon";

revoke trigger on table "public"."user_roles" from "anon";

revoke truncate on table "public"."user_roles" from "anon";

revoke update on table "public"."user_roles" from "anon";

revoke delete on table "public"."user_roles" from "authenticated";

revoke insert on table "public"."user_roles" from "authenticated";

revoke references on table "public"."user_roles" from "authenticated";

revoke select on table "public"."user_roles" from "authenticated";

revoke trigger on table "public"."user_roles" from "authenticated";

revoke truncate on table "public"."user_roles" from "authenticated";

revoke update on table "public"."user_roles" from "authenticated";

revoke delete on table "public"."user_roles" from "service_role";

revoke insert on table "public"."user_roles" from "service_role";

revoke references on table "public"."user_roles" from "service_role";

revoke select on table "public"."user_roles" from "service_role";

revoke trigger on table "public"."user_roles" from "service_role";

revoke truncate on table "public"."user_roles" from "service_role";

revoke update on table "public"."user_roles" from "service_role";

revoke delete on table "public"."user_roles" from "supabase_auth_admin";

revoke insert on table "public"."user_roles" from "supabase_auth_admin";

revoke references on table "public"."user_roles" from "supabase_auth_admin";

revoke select on table "public"."user_roles" from "supabase_auth_admin";

revoke trigger on table "public"."user_roles" from "supabase_auth_admin";

revoke truncate on table "public"."user_roles" from "supabase_auth_admin";

revoke update on table "public"."user_roles" from "supabase_auth_admin";

alter table "public"."role_permissions" drop constraint "role_permissions_role_permission_key";

alter table "public"."user_roles" drop constraint "user_roles_user_id_fkey";

alter table "public"."user_roles" drop constraint "user_roles_user_id_role_key";

drop function if exists "public"."custom_access_token_hook"(event jsonb);

alter table "public"."role_permissions" drop constraint "role_permissions_pkey";

alter table "public"."user_roles" drop constraint "user_roles_pkey";

drop index if exists "public"."role_permissions_pkey";

drop index if exists "public"."role_permissions_role_permission_key";

drop index if exists "public"."user_roles_pkey";

drop index if exists "public"."user_roles_user_id_role_key";

drop table "public"."role_permissions";

drop table "public"."user_roles";

drop type "public"."app_permission";

drop type "public"."app_role";


