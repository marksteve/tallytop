create table "public"."finals" (
    "team_id" uuid not null,
    "problem_id" uuid not null,
    "attempts" text not null default ''::text,
    "zone" smallint not null default '0'::smallint,
    "top" smallint not null default '0'::smallint,
    "created_at" timestamp with time zone default now()
);


alter table "public"."finals" enable row level security;

CREATE UNIQUE INDEX finals_pkey ON public.finals USING btree (team_id, problem_id);

alter table "public"."finals" add constraint "finals_pkey" PRIMARY KEY using index "finals_pkey";

alter table "public"."finals" add constraint "finals_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES finals_problems(id) not valid;

alter table "public"."finals" validate constraint "finals_problem_id_fkey";

alter table "public"."finals" add constraint "finals_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) not valid;

alter table "public"."finals" validate constraint "finals_team_id_fkey";


