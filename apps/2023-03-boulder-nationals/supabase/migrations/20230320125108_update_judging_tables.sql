drop policy "Everyone can read" on "public"."finals";

drop policy "Judges can do all" on "public"."finals";

drop policy "Everyone can read" on "public"."finals_problems";

alter table "public"."finals" drop constraint "finals_competitor_id_fkey";

alter table "public"."finals" drop constraint "finals_problem_id_fkey";

alter table "public"."qualis" drop constraint "qualis_competitor_id_fkey";

alter table "public"."qualis" drop constraint "qualis_problem_id_fkey";

alter table "public"."semis" drop constraint "semis_competitor_id_fkey";

alter table "public"."semis" drop constraint "semis_problem_id_fkey";

drop view if exists "public"."finals_scores";

alter table "public"."finals" drop constraint "finals_pkey";

alter table "public"."finals_problems" drop constraint "finals_problems_pkey";

alter table "public"."qualis" drop constraint "qualis_pkey";

alter table "public"."semis" drop constraint "semis_pkey";

alter table "public"."semis_problems" drop constraint "qualis_problems_pkey";

drop index if exists "public"."qualis_pkey";

drop index if exists "public"."qualis_problems_pkey";

drop index if exists "public"."qualis_problems_wall_idx";

drop index if exists "public"."semis_pkey";

drop index if exists "public"."finals_pkey";

drop index if exists "public"."finals_problems_pkey";

drop index if exists "public"."finals_problems_wall_idx";

drop table "public"."finals";

drop table "public"."finals_problems";

drop table "public"."qualis";

drop table "public"."semis";

drop table "public"."semis_problems";

create table "public"."climbs" (
    "competitor_id" uuid not null,
    "problem_id" uuid not null,
    "attempts" text not null default ''::text,
    "zone" smallint not null default '0'::smallint,
    "top" smallint not null default '0'::smallint,
    "created_at" timestamp with time zone default now()
);


alter table "public"."climbs" enable row level security;

create table "public"."problems" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "wall" text not null,
    "color" text,
    "round" text not null,
    "category" text not null
);


alter table "public"."problems" enable row level security;

CREATE UNIQUE INDEX finals_pkey ON public.climbs USING btree (problem_id, competitor_id);

CREATE UNIQUE INDEX finals_problems_pkey ON public.problems USING btree (id);

CREATE INDEX finals_problems_wall_idx ON public.problems USING btree (wall);

alter table "public"."climbs" add constraint "finals_pkey" PRIMARY KEY using index "finals_pkey";

alter table "public"."problems" add constraint "finals_problems_pkey" PRIMARY KEY using index "finals_problems_pkey";

alter table "public"."climbs" add constraint "climbs_competitor_id_fkey" FOREIGN KEY (competitor_id) REFERENCES competitors(id) not valid;

alter table "public"."climbs" validate constraint "climbs_competitor_id_fkey";

alter table "public"."climbs" add constraint "climbs_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES problems(id) not valid;

alter table "public"."climbs" validate constraint "climbs_problem_id_fkey";

create or replace view "public"."scores" as  WITH wall_results AS (
         SELECT ct.competitor_id,
            ct.wall_1,
            ct.wall_2,
            ct.wall_3,
            ct.wall_4
           FROM crosstab('
SELECT competitor_id,
  problems.wall,
  CASE
    WHEN top > 0 THEN ''top''
    WHEN zone > 0 THEN ''zone''
    ELSE ''fail''
  END AS result
FROM climbs
  INNER JOIN problems ON problems.id = climbs.problem_id
ORDER
	BY 1, 2
'::text) ct(competitor_id uuid, wall_1 text, wall_2 text, wall_3 text, wall_4 text)
        )
 SELECT climbs.competitor_id,
    problems.round,
    problems.category,
    ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4] AS walls,
    count(*) FILTER (WHERE (climbs.top > 0)) AS tops,
    count(*) FILTER (WHERE (climbs.zone > 0)) AS zones,
    sum(climbs.top) AS top_attempts,
    sum(climbs.zone) AS zone_attempts
   FROM ((climbs
     LEFT JOIN problems ON ((problems.id = climbs.problem_id)))
     JOIN wall_results ON ((wall_results.competitor_id = climbs.competitor_id)))
  GROUP BY climbs.competitor_id, problems.round, problems.category, ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4]
  ORDER BY (count(*) FILTER (WHERE (climbs.top > 0))) DESC, (count(*) FILTER (WHERE (climbs.zone > 0))) DESC, (sum(climbs.top)), (sum(climbs.zone));


create policy "Everyone can read"
on "public"."climbs"
as permissive
for select
to public
using (true);


create policy "Judges can do all"
on "public"."climbs"
as permissive
for all
to authenticated
using (true)
with check ((auth.uid() IN ( SELECT judges.id
   FROM judges)));


create policy "Everyone can read"
on "public"."problems"
as permissive
for select
to public
using (true);



