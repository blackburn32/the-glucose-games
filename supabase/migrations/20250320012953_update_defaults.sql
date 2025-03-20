alter table "public"."thresholds" alter column "daily_percent_time_in_range" set default '80'::smallint;

alter table "public"."thresholds" alter column "high" set default '180'::double precision;

alter table "public"."thresholds" alter column "high" set data type double precision using "high"::double precision;

alter table "public"."thresholds" alter column "low" set default '70'::double precision;

alter table "public"."thresholds" alter column "low" set data type double precision using "low"::double precision;

alter table "public"."thresholds" alter column "target" set default '110'::double precision;

alter table "public"."thresholds" alter column "target" set data type double precision using "target"::double precision;
