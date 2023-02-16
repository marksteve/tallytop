create extension if not exists "tablefunc" with schema "public" version '1.0';

create or replace view "public"."finals_scores" as  WITH wall_results AS (
         SELECT ct.team_id,
            ct.wall_1,
            ct.wall_2,
            ct.wall_3,
            ct.wall_4
           FROM crosstab('
		select
			team_id,
			finals_problems.wall,
			case
				when top > 0 then ''top''
				when zone > 0 then ''zone''
				else ''fail''
			end as result
		from
			finals 
		left join finals_problems on finals_problems.id = finals.problem_id
		order by 1, 2
	'::text) ct(team_id uuid, wall_1 text, wall_2 text, wall_3 text, wall_4 text)
        )
 SELECT teams.name,
    ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4] AS walls,
    count(*) FILTER (WHERE (finals.top > 0)) AS tops,
    count(*) FILTER (WHERE (finals.zone > 0)) AS zones,
    sum(finals.top) AS top_attempts,
    sum(finals.zone) AS zone_attempts
   FROM ((finals
     LEFT JOIN wall_results ON ((wall_results.team_id = finals.team_id)))
     LEFT JOIN teams ON ((teams.id = finals.team_id)))
  GROUP BY teams.name, ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4]
  ORDER BY (count(*) FILTER (WHERE (finals.top > 0))) DESC, (count(*) FILTER (WHERE (finals.zone > 0))) DESC, (sum(finals.top)), (sum(finals.zone));


create policy "Everyone can read"
on "public"."finals"
as permissive
for select
to public
using (true);


create policy "Judges can do all"
on "public"."finals"
as permissive
for all
to authenticated
using (true)
with check (true);



