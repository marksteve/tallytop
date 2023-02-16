drop policy "Everyone can read" on "public"."problems";

alter table "public"."qualis" drop constraint "qualis_problem_id_fkey";

drop view if exists "public"."qualis_scores";

alter table "public"."problems" drop constraint "problems_pkey";

drop index if exists "public"."problems_pkey";

drop index if exists "public"."problems_wall_idx";

drop table "public"."problems";

create table "public"."qualis_problems" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "wall" text not null,
    "description" text not null,
    "points" numeric not null,
    "color" text
);


alter table "public"."qualis_problems" enable row level security;

CREATE UNIQUE INDEX problems_pkey ON public.qualis_problems USING btree (id);

CREATE INDEX problems_wall_idx ON public.qualis_problems USING btree (wall);

alter table "public"."qualis_problems" add constraint "problems_pkey" PRIMARY KEY using index "problems_pkey";

alter table "public"."qualis" add constraint "qualis_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES qualis_problems(id) not valid;

alter table "public"."qualis" validate constraint "qualis_problem_id_fkey";

create or replace view "public"."qualis_scores" as  SELECT teams.id,
    teams.name,
    sum(((
        CASE
            WHEN qualis.is_flash THEN 2
            ELSE 1
        END)::numeric * qualis_problems.points)) AS score,
    sum((qualis.is_flash)::integer) AS flashes
   FROM ((teams
     LEFT JOIN qualis ON ((qualis.team_id = teams.id)))
     LEFT JOIN qualis_problems ON ((qualis_problems.id = qualis.problem_id)))
  GROUP BY teams.id, teams.name
  ORDER BY (sum(((
        CASE
            WHEN qualis.is_flash THEN 2
            ELSE 1
        END)::numeric * qualis_problems.points))) DESC;

create policy "Everyone can read"
on "public"."qualis_problems"
as permissive
for select
to public
using (true);
