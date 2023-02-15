create table "public"."problems" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "wall" text not null,
    "description" text not null,
    "points" numeric not null,
    "color" text
);


alter table "public"."problems" enable row level security;

CREATE UNIQUE INDEX problems_pkey ON public.problems USING btree (id);

CREATE INDEX problems_wall_idx ON public.problems USING btree (wall);

alter table "public"."problems" add constraint "problems_pkey" PRIMARY KEY using index "problems_pkey";

create policy "Everyone can read"
on "public"."problems"
as permissive
for select
to public
using (true);



