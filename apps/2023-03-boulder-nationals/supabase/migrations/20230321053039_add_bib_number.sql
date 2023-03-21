alter table "public"."competitors" add column "bib_number" text;

alter table "public"."competitors" alter column "category" set not null;

alter table "public"."competitors" alter column "last_name" set not null;


