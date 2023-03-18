create extension if not exists "tablefunc" with schema "public" version '1.0';

create table "public"."competitors" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "first_name" text not null,
    "category" text,
    "last_name" text
);


alter table "public"."competitors" enable row level security;

create table "public"."finals" (
    "competitor_id" uuid not null,
    "problem_id" uuid not null,
    "attempts" text not null default ''::text,
    "zone" smallint not null default '0'::smallint,
    "top" smallint not null default '0'::smallint,
    "created_at" timestamp with time zone default now()
);


alter table "public"."finals" enable row level security;

create table "public"."finals_problems" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "wall" text not null,
    "color" text
);


alter table "public"."finals_problems" enable row level security;

create table "public"."judges" (
    "id" uuid not null,
    "name" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."judges" enable row level security;

CREATE UNIQUE INDEX finals_pkey ON public.finals USING btree (problem_id, competitor_id);

CREATE UNIQUE INDEX finals_problems_pkey ON public.finals_problems USING btree (id);

CREATE INDEX finals_problems_wall_idx ON public.finals_problems USING btree (wall);

CREATE UNIQUE INDEX judges_pkey ON public.judges USING btree (id);

CREATE UNIQUE INDEX teams_pkey ON public.competitors USING btree (id);

alter table "public"."competitors" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."finals" add constraint "finals_pkey" PRIMARY KEY using index "finals_pkey";

alter table "public"."finals_problems" add constraint "finals_problems_pkey" PRIMARY KEY using index "finals_problems_pkey";

alter table "public"."judges" add constraint "judges_pkey" PRIMARY KEY using index "judges_pkey";

alter table "public"."finals" add constraint "finals_competitor_id_fkey" FOREIGN KEY (competitor_id) REFERENCES competitors(id) not valid;

alter table "public"."finals" validate constraint "finals_competitor_id_fkey";

alter table "public"."finals" add constraint "finals_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES finals_problems(id) not valid;

alter table "public"."finals" validate constraint "finals_problem_id_fkey";

alter table "public"."judges" add constraint "judges_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."judges" validate constraint "judges_id_fkey";

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
 SELECT competitors.first_name AS name,
    ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4] AS walls,
    count(*) FILTER (WHERE (finals.top > 0)) AS tops,
    count(*) FILTER (WHERE (finals.zone > 0)) AS zones,
    sum(finals.top) AS top_attempts,
    sum(finals.zone) AS zone_attempts
   FROM ((finals
     LEFT JOIN wall_results ON ((wall_results.team_id = finals.competitor_id)))
     LEFT JOIN competitors ON ((competitors.id = finals.competitor_id)))
  GROUP BY competitors.first_name, ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4]
  ORDER BY (count(*) FILTER (WHERE (finals.top > 0))) DESC, (count(*) FILTER (WHERE (finals.zone > 0))) DESC, (sum(finals.top)), (sum(finals.zone));

create policy "Everyone can read"
on "public"."competitors"
as permissive
for select
to public
using (true);


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
with check ((auth.uid() IN ( SELECT judges.id
   FROM judges)));


create policy "Everyone can read"
on "public"."finals_problems"
as permissive
for select
to public
using (true);


create policy "Everyone can read"
on "public"."judges"
as permissive
for select
to public
using (true);



