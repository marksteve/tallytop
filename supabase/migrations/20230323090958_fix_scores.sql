create or replace view "public"."scores" as  WITH wall_results AS (
         SELECT ct.id,
            ct.wall_1,
            ct.wall_2,
            ct.wall_3,
            ct.wall_4,
            ct.wall_5
           FROM crosstab('
SELECT CONCAT(competitor_id, ''-'', problems.round) AS id,
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
'::text) ct(id text, wall_1 text, wall_2 text, wall_3 text, wall_4 text, wall_5 text)
        )
 SELECT competitors.id AS competitor_id,
    competitors.bib_number AS competitor_bib_number,
    competitors.first_name AS competitor_first_name,
    competitors.last_name AS competitor_last_name,
    problems.round,
    problems.category,
    ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4, wall_results.wall_5] AS walls,
    count(*) FILTER (WHERE (climbs.top > 0)) AS tops,
    count(*) FILTER (WHERE (climbs.zone > 0)) AS zones,
    sum(climbs.top) AS top_attempts,
    sum(climbs.zone) AS zone_attempts
   FROM (((climbs
     LEFT JOIN competitors ON ((competitors.id = climbs.competitor_id)))
     LEFT JOIN problems ON ((problems.id = climbs.problem_id)))
     JOIN wall_results ON ((wall_results.id = concat(climbs.competitor_id, '-', problems.round))))
  GROUP BY competitors.id, competitors.bib_number, competitors.first_name, competitors.last_name, problems.round, problems.category, ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4, wall_results.wall_5]
  ORDER BY (count(*) FILTER (WHERE (climbs.top > 0))) DESC, (count(*) FILTER (WHERE (climbs.zone > 0))) DESC, (sum(climbs.top)), (sum(climbs.zone));



