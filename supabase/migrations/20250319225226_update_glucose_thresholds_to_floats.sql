alter table "public"."thresholds" alter column "high" set data type double precision using "high"::double precision;

alter table "public"."thresholds" alter column "low" set data type double precision using "low"::double precision;

alter table "public"."thresholds" alter column "target" drop default;

alter table "public"."thresholds" alter column "target" set data type double precision using "target"::double precision;
