drop view if exists "public"."scores";

alter table "public"."startlists" drop constraint "startlists_pkey";

drop index if exists "public"."startlists_pkey";

CREATE UNIQUE INDEX startlists_pkey ON public.startlists USING btree (competitor_id, category, round);

alter table "public"."startlists" add constraint "startlists_pkey" PRIMARY KEY using index "startlists_pkey";

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
 SELECT competitors.id AS competitor_id,
    competitors.bib_number AS competitor_bib_number,
    competitors.first_name AS competitor_first_name,
    competitors.last_name AS competitor_last_name,
    problems.round,
    problems.category,
    ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4] AS walls,
    count(*) FILTER (WHERE (climbs.top > 0)) AS tops,
    count(*) FILTER (WHERE (climbs.zone > 0)) AS zones,
    sum(climbs.top) AS top_attempts,
    sum(climbs.zone) AS zone_attempts
   FROM (((climbs
     LEFT JOIN competitors ON ((competitors.id = climbs.competitor_id)))
     LEFT JOIN problems ON ((problems.id = climbs.problem_id)))
     JOIN wall_results ON ((wall_results.competitor_id = climbs.competitor_id)))
  GROUP BY competitors.id, competitors.bib_number, competitors.first_name, competitors.last_name, problems.round, problems.category, ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4]
  ORDER BY (count(*) FILTER (WHERE (climbs.top > 0))) DESC, (count(*) FILTER (WHERE (climbs.zone > 0))) DESC, (sum(climbs.top)), (sum(climbs.zone));


create policy "Judges can do all"
on "public"."startlists"
as permissive
for all
to authenticated
using (true)
with check ((auth.uid() IN ( SELECT judges.id
   FROM judges)));



