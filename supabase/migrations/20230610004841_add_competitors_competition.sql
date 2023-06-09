alter table "public"."competitors" add column "competition" text;
update "public"."competitors" set "competition" = '2023-03-boulder-nationals';
alter table "public"."competitors" alter column "competition" set not null;
create index "competitors_competition_key" on "public"."competitors" ("competition");
