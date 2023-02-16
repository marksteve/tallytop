create table "public"."finals_problems" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "wall" text not null,
    "color" text
);


alter table "public"."finals_problems" enable row level security;

CREATE UNIQUE INDEX finals_problems_pkey ON public.finals_problems USING btree (id);

CREATE INDEX finals_problems_wall_idx ON public.finals_problems USING btree (wall);

alter table "public"."finals_problems" add constraint "finals_problems_pkey" PRIMARY KEY using index "finals_problems_pkey";

create policy "Everyone can read"
on "public"."finals_problems"
as permissive
for select
to public
using (true);



