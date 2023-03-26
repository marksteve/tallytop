WITH wall_results AS (
  SELECT *
  FROM crosstab(
      '
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
'::text
    ) ct(
      id text,
      wall_1 text,
      wall_2 text,
      wall_3 text,
      wall_4 text,
      wall_5 text
    )
)
SELECT competitors.id as competitor_id,
  competitors.bib_number as competitor_bib_number,
  competitors.first_name as competitor_first_name,
  competitors.last_name as competitor_last_name,
  problems.round,
  problems.category,
  ARRAY [wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4, wall_results.wall_5] AS walls,
  COUNT(*) FILTER (
    WHERE climbs.top > 0
  ) AS tops,
  COUNT(*) FILTER (
    WHERE climbs.zone > 0
  ) AS zones,
  SUM(climbs.top) AS top_attempts,
  SUM(climbs.zone) AS zone_attempts,
  CASE problems.round
    WHEN 'qualis' THEN MIN(startlists.order)
    ELSE -MIN(startlists.order)
  END AS countback
FROM climbs
  LEFT JOIN competitors ON competitors.id = climbs.competitor_id
  LEFT JOIN problems ON problems.id = climbs.problem_id
  LEFT JOIN startlists ON startlists.round = problems.round AND startlists.competitor_id = climbs.competitor_id
  INNER JOIN wall_results ON wall_results.id = CONCAT(climbs.competitor_id, '-', problems.round)
GROUP BY 1,
  2,
  3,
  4,
  5,
  6,
  7
ORDER BY 8 DESC,
  9 DESC,
  10,
  11,
  12