alter table "public"."climbs" alter column "competition" set not null;

alter table "public"."judges" alter column "competition" set not null;

alter table "public"."problems" alter column "competition" set not null;

alter table "public"."startlists" alter column "competition" set not null;

drop view if exists public.scores;

create view
  public.scores as
with
  wall_results as (
    select
      ct.id,
      ct.wall_1,
      ct.wall_2,
      ct.wall_3,
      ct.wall_4,
      ct.wall_5
    from
      crosstab (
        '
SELECT CONCAT(competitor_id, ''-'', problems.competition, ''-'', problems.round) AS id,
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
      ) ct (
        id text,
        wall_1 text,
        wall_2 text,
        wall_3 text,
        wall_4 text,
        wall_5 text
      )
  )
select
  competitors.id as competitor_id,
  competitors.bib_number as competitor_bib_number,
  competitors.first_name as competitor_first_name,
  competitors.last_name as competitor_last_name,
  problems.competition,
  problems.round,
  problems.category,
  array[
    wall_results.wall_1,
    wall_results.wall_2,
    wall_results.wall_3,
    wall_results.wall_4,
    wall_results.wall_5
  ] as walls,
  count(*) filter (
    where
      climbs.top > 0
  ) as tops,
  count(*) filter (
    where
      climbs.zone > 0
  ) as zones,
  sum(climbs.top) as top_attempts,
  sum(climbs.zone) as zone_attempts,
  case problems.round
    when 'qualis'::text then min(startlists."order")
    else - min(startlists."order")
  end as countback
from
  climbs
  left join competitors on competitors.id = climbs.competitor_id
  left join problems on problems.id = climbs.problem_id
  left join startlists on startlists.round = problems.round
  and startlists.competitor_id = climbs.competitor_id
  join wall_results on wall_results.id = concat(climbs.competitor_id, '-', problems.competition, '-', problems.round)
group by 1, 2, 3, 4, 5, 6, 7, 8
order by 9 desc, 10 desc, 11, 12, 13;