drop policy "Judges can do all" on "public"."finals";

drop policy "Judges can do all" on "public"."qualis";

create table "public"."judges" (
    "id" uuid not null,
    "name" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."judges" enable row level security;

CREATE UNIQUE INDEX judges_pkey ON public.judges USING btree (id);

alter table "public"."judges" add constraint "judges_pkey" PRIMARY KEY using index "judges_pkey";

alter table "public"."judges" add constraint "judges_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."judges" validate constraint "judges_id_fkey";

create policy "Everyone can read"
on "public"."judges"
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


create policy "Judges can do all"
on "public"."qualis"
as permissive
for all
to authenticated
using (true)
with check ((auth.uid() IN ( SELECT judges.id
   FROM judges)));



