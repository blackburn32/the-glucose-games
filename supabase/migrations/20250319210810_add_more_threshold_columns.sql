alter table "public"."thresholds" add column "daily_percent_time_in_range" smallint not null default '70'::smallint;

alter table "public"."thresholds" add column "target" smallint not null default '110'::smallint;

create policy "Enable delete for users based on user_id"
on "public"."thresholds"
as permissive
for delete
to public
using ((auth.uid() = user_id));
