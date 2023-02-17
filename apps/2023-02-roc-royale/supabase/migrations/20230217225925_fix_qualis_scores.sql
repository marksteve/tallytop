create or replace view "public"."qualis_scores" as  SELECT teams.id,
    teams.name,
    COALESCE(sum(((
        CASE
            WHEN qualis.is_flash THEN 2
            ELSE 1
        END)::numeric * qualis_problems.points)), (0)::numeric) AS score,
    sum((qualis.is_flash)::integer) AS flashes
   FROM ((teams
     LEFT JOIN qualis ON ((qualis.team_id = teams.id)))
     LEFT JOIN qualis_problems ON ((qualis_problems.id = qualis.problem_id)))
  GROUP BY teams.id, teams.name
  ORDER BY COALESCE(sum(((
        CASE
            WHEN qualis.is_flash THEN 2
            ELSE 1
        END)::numeric * qualis_problems.points)), (0)::numeric) DESC;



