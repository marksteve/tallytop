create table "public"."qualis" (
    "team_id" uuid not null,
    "problem_id" uuid not null,
    "is_top" boolean,
    "is_flash" boolean,
    "created_at" timestamp with time zone default now()
);


alter table "public"."qualis" enable row level security;

create table "public"."teams" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "name" text not null
);


alter table "public"."teams" enable row level security;

CREATE UNIQUE INDEX qualis_pkey ON public.qualis USING btree (team_id, problem_id);

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id);

alter table "public"."qualis" add constraint "qualis_pkey" PRIMARY KEY using index "qualis_pkey";

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."qualis" add constraint "qualis_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES problems(id) not valid;

alter table "public"."qualis" validate constraint "qualis_problem_id_fkey";

alter table "public"."qualis" add constraint "qualis_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) not valid;

alter table "public"."qualis" validate constraint "qualis_team_id_fkey";

create policy "Everyone can read"
on "public"."teams"
as permissive
for select
to public
using (true);



