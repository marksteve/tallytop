alter table "public"."problems" rename column "wall" to "name";

drop view if exists public.scores;

create view
  public.scores as
with
  results as (
    select
      ct.id,
      ct.problem_1,
      ct.problem_2,
      ct.problem_3,
      ct.problem_4,
      ct.problem_5
    from
      crosstab (
        '
SELECT CONCAT(competitor_id, ''-'', problems.competition, ''-'', problems.round) AS id,
  problems.name,
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
        problem_1 text,
        problem_2 text,
        problem_3 text,
        problem_4 text,
        problem_5 text
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
    results.problem_1,
    results.problem_2,
    results.problem_3,
    results.problem_4,
    results.problem_5
  ] as problems,
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
  join results on results.id = concat(
    climbs.competitor_id,
    '-',
    problems.competition,
    '-',
    problems.round
  )
group by 1, 2, 3, 4, 5, 6, 7, 8
order by 9 desc, 10 desc, 11, 12, 13;
