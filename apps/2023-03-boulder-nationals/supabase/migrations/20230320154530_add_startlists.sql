create table "public"."startlists" (
    "created_at" timestamp with time zone default now(),
    "competitor_id" uuid not null,
    "category" text not null,
    "order" smallint not null
);


alter table "public"."startlists" enable row level security;

CREATE UNIQUE INDEX startlists_pkey ON public.startlists USING btree (competitor_id, category);

alter table "public"."startlists" add constraint "startlists_pkey" PRIMARY KEY using index "startlists_pkey";

alter table "public"."startlists" add constraint "startlists_competitor_id_fkey" FOREIGN KEY (competitor_id) REFERENCES competitors(id) not valid;

alter table "public"."startlists" validate constraint "startlists_competitor_id_fkey";

create policy "Everyone can read"
on "public"."startlists"
as permissive
for select
to public
using (true);



