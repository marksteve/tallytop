create or replace view "public"."qualis_scores" as  SELECT teams.name,
    sum(((
        CASE
            WHEN qualis.is_flash THEN 2
            ELSE 1
        END)::numeric * problems.points)) AS score,
    sum((qualis.is_flash)::integer) AS flashes
   FROM ((teams
     LEFT JOIN qualis ON ((qualis.team_id = teams.id)))
     LEFT JOIN problems ON ((problems.id = qualis.problem_id)))
  GROUP BY teams.name
  ORDER BY (sum(((
        CASE
            WHEN qualis.is_flash THEN 2
            ELSE 1
        END)::numeric * problems.points))) DESC;


create policy "Everyone can read"
on "public"."qualis"
as permissive
for select
to public
using (true);


create policy "Judges can do all"
on "public"."qualis"
as permissive
for all
to authenticated
using (true)
with check (true);



