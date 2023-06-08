create table "public"."qualis" (
    "competitor_id" uuid not null,
    "problem_id" uuid not null,
    "attempts" text not null default ''::text,
    "zone" smallint not null default '0'::smallint,
    "top" smallint not null default '0'::smallint,
    "created_at" timestamp with time zone default now()
);


alter table "public"."qualis" enable row level security;

create table "public"."semis" (
    "competitor_id" uuid not null,
    "problem_id" uuid not null,
    "attempts" text not null default ''::text,
    "zone" smallint not null default '0'::smallint,
    "top" smallint not null default '0'::smallint,
    "created_at" timestamp with time zone default now()
);


alter table "public"."semis" enable row level security;

create table "public"."semis_problems" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "wall" text not null,
    "color" text
);


alter table "public"."semis_problems" enable row level security;

CREATE UNIQUE INDEX qualis_pkey ON public.qualis USING btree (problem_id, competitor_id);

CREATE UNIQUE INDEX qualis_problems_pkey ON public.semis_problems USING btree (id);

CREATE INDEX qualis_problems_wall_idx ON public.semis_problems USING btree (wall);

CREATE UNIQUE INDEX semis_pkey ON public.semis USING btree (problem_id, competitor_id);

alter table "public"."qualis" add constraint "qualis_pkey" PRIMARY KEY using index "qualis_pkey";

alter table "public"."semis" add constraint "semis_pkey" PRIMARY KEY using index "semis_pkey";

alter table "public"."semis_problems" add constraint "qualis_problems_pkey" PRIMARY KEY using index "qualis_problems_pkey";

alter table "public"."qualis" add constraint "qualis_competitor_id_fkey" FOREIGN KEY (competitor_id) REFERENCES competitors(id) not valid;

alter table "public"."qualis" validate constraint "qualis_competitor_id_fkey";

alter table "public"."qualis" add constraint "qualis_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES finals_problems(id) not valid;

alter table "public"."qualis" validate constraint "qualis_problem_id_fkey";

alter table "public"."semis" add constraint "semis_competitor_id_fkey" FOREIGN KEY (competitor_id) REFERENCES competitors(id) not valid;

alter table "public"."semis" validate constraint "semis_competitor_id_fkey";

alter table "public"."semis" add constraint "semis_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES finals_problems(id) not valid;

alter table "public"."semis" validate constraint "semis_problem_id_fkey";


