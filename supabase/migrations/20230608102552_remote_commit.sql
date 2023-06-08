CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);

CREATE INDEX refresh_token_session_id ON auth.refresh_tokens USING btree (session_id);

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION auth.email()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select 
  	coalesce(
		nullif(current_setting('request.jwt.claim.email', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
	)::text
$function$
;

CREATE OR REPLACE FUNCTION auth.role()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select 
  	coalesce(
		nullif(current_setting('request.jwt.claim.role', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
	)::text
$function$
;

CREATE OR REPLACE FUNCTION auth.uid()
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
  select 
  	coalesce(
		nullif(current_setting('request.jwt.claim.sub', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
	)::uuid
$function$
;


create or replace view "public"."scores" as  WITH wall_results AS (
         SELECT ct.id,
            ct.wall_1,
            ct.wall_2,
            ct.wall_3,
            ct.wall_4,
            ct.wall_5
           FROM crosstab('
SELECT CONCAT(competitor_id, ''-'', problems.round) AS id,
  problems.wall,
  CASE
    WHEN top > 0 THEN ''top''
    WHEN zone > 0 THEN ''zone''
    ELSE ''fail''
  END AS result
FROM climbs
  INNER JOIN problems ON problems.id = climbs.problem_id
ORDER
	BY 1, 2
'::text) ct(id text, wall_1 text, wall_2 text, wall_3 text, wall_4 text, wall_5 text)
        )
 SELECT competitors.id AS competitor_id,
    competitors.bib_number AS competitor_bib_number,
    competitors.first_name AS competitor_first_name,
    competitors.last_name AS competitor_last_name,
    problems.round,
    problems.category,
    ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4, wall_results.wall_5] AS walls,
    count(*) FILTER (WHERE (climbs.top > 0)) AS tops,
    count(*) FILTER (WHERE (climbs.zone > 0)) AS zones,
    sum(climbs.top) AS top_attempts,
    sum(climbs.zone) AS zone_attempts,
        CASE problems.round
            WHEN 'qualis'::text THEN min(startlists."order")
            ELSE (- min(startlists."order"))
        END AS countback
   FROM ((((climbs
     LEFT JOIN competitors ON ((competitors.id = climbs.competitor_id)))
     LEFT JOIN problems ON ((problems.id = climbs.problem_id)))
     LEFT JOIN startlists ON (((startlists.round = problems.round) AND (startlists.competitor_id = climbs.competitor_id))))
     JOIN wall_results ON ((wall_results.id = concat(climbs.competitor_id, '-', problems.round))))
  GROUP BY competitors.id, competitors.bib_number, competitors.first_name, competitors.last_name, problems.round, problems.category, ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4, wall_results.wall_5]
  ORDER BY (count(*) FILTER (WHERE (climbs.top > 0))) DESC, (count(*) FILTER (WHERE (climbs.zone > 0))) DESC, (sum(climbs.top)), (sum(climbs.zone)),
        CASE problems.round
            WHEN 'qualis'::text THEN min(startlists."order")
            ELSE (- min(startlists."order"))
        END;



create schema if not exists "qdb_2022";

create table "qdb_2022"."attempts" (
    "created_at" timestamp with time zone default now(),
    "competitor_id" uuid not null,
    "climb_id" uuid not null,
    "is_zone" boolean,
    "is_top" boolean,
    "hold" numeric,
    "is_plus" boolean,
    "count" bigint
);


alter table "qdb_2022"."attempts" enable row level security;

create table "qdb_2022"."attempts_finals" (
    "created_at" timestamp with time zone default now(),
    "competitor_id" uuid not null,
    "climb_id" uuid not null,
    "zone_attempts" bigint,
    "top_attempts" bigint
);


alter table "qdb_2022"."attempts_finals" enable row level security;

create table "qdb_2022"."climbs" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "name" text,
    "color" text,
    "score" numeric,
    "round_id" uuid,
    "division_id" uuid
);


alter table "qdb_2022"."climbs" enable row level security;

create table "qdb_2022"."competitors" (
    "id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "division_id" uuid not null,
    "name" text,
    "number" text
);


alter table "qdb_2022"."competitors" enable row level security;

create table "qdb_2022"."comps" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "name" text not null,
    "current_round_id" uuid
);


alter table "qdb_2022"."comps" enable row level security;

create table "qdb_2022"."divisions" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "comp_id" uuid not null,
    "name" text not null
);


alter table "qdb_2022"."divisions" enable row level security;

create table "qdb_2022"."rounds" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "comp_id" uuid not null,
    "name" text not null,
    "type" text not null,
    "order" bigint
);


alter table "qdb_2022"."rounds" enable row level security;

CREATE UNIQUE INDEX attempts_pkey ON qdb_2022.attempts USING btree (competitor_id, climb_id);

CREATE UNIQUE INDEX attempts_v2_pkey ON qdb_2022.attempts_finals USING btree (competitor_id, climb_id);

CREATE UNIQUE INDEX competitors_pkey ON qdb_2022.competitors USING btree (id);

CREATE UNIQUE INDEX comps_pkey ON qdb_2022.comps USING btree (id);

CREATE UNIQUE INDEX divisions_pkey ON qdb_2022.divisions USING btree (id);

CREATE UNIQUE INDEX rounds_pkey ON qdb_2022.rounds USING btree (id);

CREATE UNIQUE INDEX routes_pkey ON qdb_2022.climbs USING btree (id);

alter table "qdb_2022"."attempts" add constraint "attempts_pkey" PRIMARY KEY using index "attempts_pkey";

alter table "qdb_2022"."attempts_finals" add constraint "attempts_v2_pkey" PRIMARY KEY using index "attempts_v2_pkey";

alter table "qdb_2022"."climbs" add constraint "routes_pkey" PRIMARY KEY using index "routes_pkey";

alter table "qdb_2022"."competitors" add constraint "competitors_pkey" PRIMARY KEY using index "competitors_pkey";

alter table "qdb_2022"."comps" add constraint "comps_pkey" PRIMARY KEY using index "comps_pkey";

alter table "qdb_2022"."divisions" add constraint "divisions_pkey" PRIMARY KEY using index "divisions_pkey";

alter table "qdb_2022"."rounds" add constraint "rounds_pkey" PRIMARY KEY using index "rounds_pkey";

alter table "qdb_2022"."attempts" add constraint "attempts_climb_id_fkey" FOREIGN KEY (climb_id) REFERENCES qdb_2022.climbs(id) not valid;

alter table "qdb_2022"."attempts" validate constraint "attempts_climb_id_fkey";

alter table "qdb_2022"."attempts" add constraint "attempts_competitor_id_fkey" FOREIGN KEY (competitor_id) REFERENCES qdb_2022.competitors(id) not valid;

alter table "qdb_2022"."attempts" validate constraint "attempts_competitor_id_fkey";

alter table "qdb_2022"."attempts_finals" add constraint "attempts_finals_climb_id_fkey" FOREIGN KEY (climb_id) REFERENCES qdb_2022.climbs(id) not valid;

alter table "qdb_2022"."attempts_finals" validate constraint "attempts_finals_climb_id_fkey";

alter table "qdb_2022"."attempts_finals" add constraint "attempts_finals_competitor_id_fkey" FOREIGN KEY (competitor_id) REFERENCES qdb_2022.competitors(id) not valid;

alter table "qdb_2022"."attempts_finals" validate constraint "attempts_finals_competitor_id_fkey";

alter table "qdb_2022"."climbs" add constraint "climbs_division_id_fkey" FOREIGN KEY (division_id) REFERENCES qdb_2022.divisions(id) not valid;

alter table "qdb_2022"."climbs" validate constraint "climbs_division_id_fkey";

alter table "qdb_2022"."climbs" add constraint "climbs_round_id_fkey" FOREIGN KEY (round_id) REFERENCES qdb_2022.rounds(id) not valid;

alter table "qdb_2022"."climbs" validate constraint "climbs_round_id_fkey";

alter table "qdb_2022"."competitors" add constraint "competitors_division_id_fkey" FOREIGN KEY (division_id) REFERENCES qdb_2022.divisions(id) not valid;

alter table "qdb_2022"."competitors" validate constraint "competitors_division_id_fkey";

alter table "qdb_2022"."competitors" add constraint "competitors_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "qdb_2022"."competitors" validate constraint "competitors_id_fkey";

alter table "qdb_2022"."comps" add constraint "comps_current_round_id_fkey" FOREIGN KEY (current_round_id) REFERENCES qdb_2022.rounds(id) not valid;

alter table "qdb_2022"."comps" validate constraint "comps_current_round_id_fkey";

alter table "qdb_2022"."divisions" add constraint "divisions_comp_id_fkey" FOREIGN KEY (comp_id) REFERENCES qdb_2022.comps(id) not valid;

alter table "qdb_2022"."divisions" validate constraint "divisions_comp_id_fkey";

create or replace view "qdb_2022"."finalists" as  SELECT raw_attempts.division_id,
    raw_attempts.id,
    raw_attempts.name,
    raw_attempts.number,
    sum(raw_attempts.zone_attempts) AS zone_attempts,
    sum(raw_attempts.zone) AS zones,
    sum(raw_attempts.top_attempts) AS top_attempts,
    sum(raw_attempts.top) AS tops
   FROM ( SELECT competitors.division_id,
            competitors.id,
            competitors.name,
            competitors.number,
            attempts_finals.zone_attempts,
            ((attempts_finals.zone_attempts > 0))::integer AS zone,
            attempts_finals.top_attempts,
            ((attempts_finals.top_attempts > 0))::integer AS top
           FROM (qdb_2022.attempts_finals
             JOIN qdb_2022.competitors ON ((competitors.id = attempts_finals.competitor_id)))) raw_attempts
  GROUP BY raw_attempts.division_id, raw_attempts.id, raw_attempts.name, raw_attempts.number
  ORDER BY raw_attempts.division_id, (sum(raw_attempts.top)) DESC, (sum(raw_attempts.zone)) DESC, (sum(raw_attempts.top_attempts)), (sum(raw_attempts.zone_attempts));


create or replace view "qdb_2022"."qualis_tops" as  SELECT competitors.division_id,
    climbs.round_id,
    climbs.id AS climb_id,
    competitors.id AS competitor_id,
    (attempts.count = 1) AS is_flash,
        CASE
            WHEN (attempts.count > 1) THEN 1
            ELSE 2
        END AS multiplier,
    count(competitors.id) OVER (PARTITION BY competitors.division_id, climbs.id) AS tops,
    (1000 / count(competitors.id) OVER (PARTITION BY competitors.division_id, climbs.id)) AS score
   FROM ((qdb_2022.climbs
     JOIN qdb_2022.attempts ON ((attempts.climb_id = climbs.id)))
     JOIN qdb_2022.competitors ON ((attempts.competitor_id = competitors.id)))
  GROUP BY competitors.division_id, climbs.round_id, climbs.id, competitors.id, (attempts.count = 1),
        CASE
            WHEN (attempts.count > 1) THEN 1
            ELSE 2
        END;


create or replace view "qdb_2022"."qualis_tops_with_climbs" as  SELECT competitors.division_id,
    climbs.round_id,
    climbs.id AS climb_id,
    climbs.name AS climb_name,
    competitors.id AS competitor_id,
    (attempts.count = 1) AS is_flash,
        CASE
            WHEN (attempts.count > 1) THEN 1
            ELSE 2
        END AS multiplier,
    count(competitors.id) OVER (PARTITION BY competitors.division_id, climbs.id) AS tops,
    (1000 / count(competitors.id) OVER (PARTITION BY competitors.division_id, climbs.id)) AS score
   FROM ((qdb_2022.climbs
     JOIN qdb_2022.attempts ON ((attempts.climb_id = climbs.id)))
     JOIN qdb_2022.competitors ON ((attempts.competitor_id = competitors.id)))
  WHERE (climbs.round_id = '2f6f8fc9-b223-4641-9b24-b40df881344b'::uuid)
  GROUP BY competitors.division_id, climbs.round_id, climbs.id, climbs.name, competitors.id, (attempts.count = 1),
        CASE
            WHEN (attempts.count > 1) THEN 1
            ELSE 2
        END;


create or replace view "qdb_2022"."qualifiers" as  SELECT ranked.id,
    ranked.number,
    ranked.name,
    ranked.division_id,
    ranked.rank
   FROM ( SELECT competitors.id,
            competitors.number,
            competitors.name,
            competitors.division_id,
            rank() OVER (PARTITION BY competitors.division_id ORDER BY (sum(multiplied.score)) DESC) AS rank
           FROM (( SELECT qualis_tops.competitor_id,
                    ((qualis_tops.multiplier)::numeric * sum(qualis_tops.score)) AS score
                   FROM qdb_2022.qualis_tops
                  WHERE (qualis_tops.round_id = '2f6f8fc9-b223-4641-9b24-b40df881344b'::uuid)
                  GROUP BY qualis_tops.competitor_id, qualis_tops.multiplier) multiplied
             JOIN qdb_2022.competitors ON ((multiplied.competitor_id = competitors.id)))
          GROUP BY competitors.id
          ORDER BY (sum(multiplied.score)) DESC) ranked
  WHERE (ranked.rank <= 6);


create or replace view "qdb_2022"."qualis_climbs" as  SELECT climbs.id,
    qualis_tops.division_id,
    climbs.name,
    qualis_tops.tops,
    min(qualis_tops.score) AS score
   FROM (qdb_2022.qualis_tops
     JOIN qdb_2022.climbs ON ((qualis_tops.climb_id = climbs.id)))
  WHERE (qualis_tops.round_id = '2f6f8fc9-b223-4641-9b24-b40df881344b'::uuid)
  GROUP BY qualis_tops.division_id, climbs.id, qualis_tops.tops
  ORDER BY qualis_tops.division_id, (min(qualis_tops.score)) DESC, climbs.name;


create or replace view "qdb_2022"."qualis_rankings" as  SELECT competitors.id,
    competitors.division_id,
    competitors.name,
    sum(multiplied.score) AS score
   FROM (( SELECT qualis_tops.competitor_id,
            ((qualis_tops.multiplier)::numeric * sum(qualis_tops.score)) AS score
           FROM qdb_2022.qualis_tops
          WHERE (qualis_tops.round_id = '2f6f8fc9-b223-4641-9b24-b40df881344b'::uuid)
          GROUP BY qualis_tops.competitor_id, qualis_tops.multiplier) multiplied
     JOIN qdb_2022.competitors ON ((multiplied.competitor_id = competitors.id)))
  GROUP BY competitors.id
  ORDER BY (sum(multiplied.score)) DESC;


create policy "Allow attempts recording"
on "qdb_2022"."attempts"
as permissive
for all
to authenticated
using (true)
with check ((auth.uid() = competitor_id));


create policy "Enable read access for all users"
on "qdb_2022"."attempts"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "qdb_2022"."attempts_finals"
as permissive
for select
to public
using (true);


create policy "Only Steve can update"
on "qdb_2022"."attempts_finals"
as permissive
for all
to public
using ((auth.uid() = '20ae4313-dc7e-458d-91d5-220c81a397e8'::uuid))
with check ((auth.uid() = '20ae4313-dc7e-458d-91d5-220c81a397e8'::uuid));


create policy "Enable read access for all users"
on "qdb_2022"."climbs"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "qdb_2022"."competitors"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "qdb_2022"."comps"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "qdb_2022"."divisions"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "qdb_2022"."rounds"
as permissive
for select
to public
using (true);



create schema if not exists "roc_royale_2023";

create table "roc_royale_2023"."finals" (
    "team_id" uuid not null,
    "problem_id" uuid not null,
    "attempts" text not null default ''::text,
    "zone" smallint not null default '0'::smallint,
    "top" smallint not null default '0'::smallint,
    "created_at" timestamp with time zone default now()
);


alter table "roc_royale_2023"."finals" enable row level security;

create table "roc_royale_2023"."finals_problems" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "wall" text not null,
    "color" text
);


alter table "roc_royale_2023"."finals_problems" enable row level security;

create table "roc_royale_2023"."judges" (
    "id" uuid not null,
    "name" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "roc_royale_2023"."judges" enable row level security;

create table "roc_royale_2023"."qualis" (
    "team_id" uuid not null,
    "problem_id" uuid not null,
    "is_top" boolean,
    "is_flash" boolean,
    "created_at" timestamp with time zone default now()
);


alter table "roc_royale_2023"."qualis" enable row level security;

create table "roc_royale_2023"."qualis_problems" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "wall" text not null,
    "description" text not null,
    "points" numeric not null,
    "color" text
);


alter table "roc_royale_2023"."qualis_problems" enable row level security;

create table "roc_royale_2023"."teams" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone default now(),
    "name" text not null
);


alter table "roc_royale_2023"."teams" enable row level security;

CREATE UNIQUE INDEX finals_pkey ON roc_royale_2023.finals USING btree (team_id, problem_id);

CREATE UNIQUE INDEX finals_problems_pkey ON roc_royale_2023.finals_problems USING btree (id);

CREATE INDEX finals_problems_wall_idx ON roc_royale_2023.finals_problems USING btree (wall);

CREATE UNIQUE INDEX judges_pkey ON roc_royale_2023.judges USING btree (id);

CREATE UNIQUE INDEX problems_pkey ON roc_royale_2023.qualis_problems USING btree (id);

CREATE INDEX problems_wall_idx ON roc_royale_2023.qualis_problems USING btree (wall);

CREATE UNIQUE INDEX qualis_pkey ON roc_royale_2023.qualis USING btree (team_id, problem_id);

CREATE UNIQUE INDEX teams_pkey ON roc_royale_2023.teams USING btree (id);

alter table "roc_royale_2023"."finals" add constraint "finals_pkey" PRIMARY KEY using index "finals_pkey";

alter table "roc_royale_2023"."finals_problems" add constraint "finals_problems_pkey" PRIMARY KEY using index "finals_problems_pkey";

alter table "roc_royale_2023"."judges" add constraint "judges_pkey" PRIMARY KEY using index "judges_pkey";

alter table "roc_royale_2023"."qualis" add constraint "qualis_pkey" PRIMARY KEY using index "qualis_pkey";

alter table "roc_royale_2023"."qualis_problems" add constraint "problems_pkey" PRIMARY KEY using index "problems_pkey";

alter table "roc_royale_2023"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "roc_royale_2023"."finals" add constraint "finals_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES roc_royale_2023.finals_problems(id) not valid;

alter table "roc_royale_2023"."finals" validate constraint "finals_problem_id_fkey";

alter table "roc_royale_2023"."finals" add constraint "finals_team_id_fkey" FOREIGN KEY (team_id) REFERENCES roc_royale_2023.teams(id) not valid;

alter table "roc_royale_2023"."finals" validate constraint "finals_team_id_fkey";

alter table "roc_royale_2023"."judges" add constraint "judges_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "roc_royale_2023"."judges" validate constraint "judges_id_fkey";

alter table "roc_royale_2023"."qualis" add constraint "qualis_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES roc_royale_2023.qualis_problems(id) not valid;

alter table "roc_royale_2023"."qualis" validate constraint "qualis_problem_id_fkey";

alter table "roc_royale_2023"."qualis" add constraint "qualis_team_id_fkey" FOREIGN KEY (team_id) REFERENCES roc_royale_2023.teams(id) not valid;

alter table "roc_royale_2023"."qualis" validate constraint "qualis_team_id_fkey";

create or replace view "roc_royale_2023"."finals_scores" as  WITH wall_results AS (
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
   FROM ((roc_royale_2023.finals
     LEFT JOIN wall_results ON ((wall_results.team_id = finals.team_id)))
     LEFT JOIN roc_royale_2023.teams ON ((teams.id = finals.team_id)))
  GROUP BY teams.name, ARRAY[wall_results.wall_1, wall_results.wall_2, wall_results.wall_3, wall_results.wall_4]
  ORDER BY (count(*) FILTER (WHERE (finals.top > 0))) DESC, (count(*) FILTER (WHERE (finals.zone > 0))) DESC, (sum(finals.top)), (sum(finals.zone));


create or replace view "roc_royale_2023"."qualis_scores" as  SELECT teams.id,
    teams.name,
    COALESCE(sum(((
        CASE
            WHEN qualis.is_flash THEN 2
            ELSE 1
        END)::numeric * qualis_problems.points)), (0)::numeric) AS score,
    sum((qualis.is_flash)::integer) AS flashes
   FROM ((roc_royale_2023.teams
     LEFT JOIN roc_royale_2023.qualis ON ((qualis.team_id = teams.id)))
     LEFT JOIN roc_royale_2023.qualis_problems ON ((qualis_problems.id = qualis.problem_id)))
  GROUP BY teams.id, teams.name
  ORDER BY COALESCE(sum(((
        CASE
            WHEN qualis.is_flash THEN 2
            ELSE 1
        END)::numeric * qualis_problems.points)), (0)::numeric) DESC;


create policy "Enable read access for all users"
on "roc_royale_2023"."finals"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "roc_royale_2023"."finals_problems"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "roc_royale_2023"."judges"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "roc_royale_2023"."qualis"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "roc_royale_2023"."qualis_problems"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "roc_royale_2023"."teams"
as permissive
for select
to public
using (true);



alter table "storage"."objects" drop column "version";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.extension(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return split_part(_filename, '.', 2);
END
$function$
;

CREATE OR REPLACE FUNCTION storage.filename(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$function$
;

CREATE OR REPLACE FUNCTION storage.foldername(name text)
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$function$
;


