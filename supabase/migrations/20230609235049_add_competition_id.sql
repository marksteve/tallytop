alter table "public"."climbs" add column "competition_id" text;
update "public"."climbs" set "competition_id" = '2023-03-boulder-nationals'; 

alter table "public"."competitors" add column "competition_id" text;
update "public"."competitors" set "competition_id" = '2023-03-boulder-nationals'; 

alter table "public"."judges" add column "competition_id" text;
update "public"."judges" set "competition_id" = '2023-03-boulder-nationals'; 

alter table "public"."problems" add column "competition_id" text;
update "public"."problems" set "competition_id" = '2023-03-boulder-nationals'; 

alter table "public"."startlists" add column "competition_id" text;
update "public"."startlists" set "competition_id" = '2023-03-boulder-nationals'; 
