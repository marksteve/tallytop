alter table "public"."climbs" rename constraint "finals_pkey" to "climbs_pkey";
alter table "public"."competitors" rename constraint "teams_pkey" to "competitors_pkey";
alter table "public"."problems" rename constraint "finals_problems_pkey" to "problems_pkey";

alter table "public"."climbs" rename column "competition_id" to "competition";
alter table "public"."judges" rename column "competition_id" to "competition";
alter table "public"."problems" rename column "competition_id" to "competition";
alter table "public"."startlists" rename column "competition_id" to "competition";

alter table "public"."competitors" drop column "competition_id";

create index "climbs_competition_key" on "public"."climbs" ("competition");
create index "judges_competition_key" on "public"."judges" ("competition");
create index "problems_competition_key" on "public"."problems" ("competition");
alter index "public"."finals_problems_wall_idx" rename to "problems_wall_key";
create index "startlists_competition_key" on "public"."startlists" ("competition");
