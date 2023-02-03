--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.5 (Debian 14.5-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "extensions";


--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: advancements; Type: TABLE; Schema: qdb_2022; Owner: supabase_admin
--

CREATE TABLE "qdb_2022"."advancements" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "division_id" "uuid",
    "round_id" "uuid",
    "order" bigint DEFAULT '0'::bigint NOT NULL
);


ALTER TABLE "qdb_2022"."advancements" OWNER TO "supabase_admin";

--
-- Name: attempts; Type: TABLE; Schema: qdb_2022; Owner: supabase_admin
--

CREATE TABLE "qdb_2022"."attempts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "competitor_id" "uuid" NOT NULL,
    "climb_id" "uuid" NOT NULL,
    "is_zone" boolean,
    "is_top" boolean,
    "hold" numeric,
    "is_plus" boolean
);


ALTER TABLE "qdb_2022"."attempts" OWNER TO "supabase_admin";

--
-- Name: climbs; Type: TABLE; Schema: qdb_2022; Owner: supabase_admin
--

CREATE TABLE "qdb_2022"."climbs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" "text",
    "color" "text",
    "score" numeric,
    "round_id" "uuid"
);


ALTER TABLE "qdb_2022"."climbs" OWNER TO "supabase_admin";

--
-- Name: competitors; Type: TABLE; Schema: qdb_2022; Owner: supabase_admin
--

CREATE TABLE "qdb_2022"."competitors" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "division_id" "uuid" NOT NULL,
    "number" "text" NOT NULL,
    "advancement_id" "uuid"
);


ALTER TABLE "qdb_2022"."competitors" OWNER TO "supabase_admin";

--
-- Name: comps; Type: TABLE; Schema: qdb_2022; Owner: supabase_admin
--

CREATE TABLE "qdb_2022"."comps" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" "text" NOT NULL
);


ALTER TABLE "qdb_2022"."comps" OWNER TO "supabase_admin";

--
-- Name: divisions; Type: TABLE; Schema: qdb_2022; Owner: supabase_admin
--

CREATE TABLE "qdb_2022"."divisions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "comp_id" "uuid" NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "qdb_2022"."divisions" OWNER TO "supabase_admin";

--
-- Name: rounds; Type: TABLE; Schema: qdb_2022; Owner: supabase_admin
--

CREATE TABLE "qdb_2022"."rounds" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "comp_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL
);


ALTER TABLE "qdb_2022"."rounds" OWNER TO "supabase_admin";

--
-- Name: advancements advancements_pkey; Type: CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."advancements"
    ADD CONSTRAINT "advancements_pkey" PRIMARY KEY ("id");


--
-- Name: attempts attempts_pkey; Type: CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."attempts"
    ADD CONSTRAINT "attempts_pkey" PRIMARY KEY ("id");


--
-- Name: competitors competitors_number_key; Type: CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."competitors"
    ADD CONSTRAINT "competitors_number_key" UNIQUE ("number");


--
-- Name: competitors competitors_pkey; Type: CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."competitors"
    ADD CONSTRAINT "competitors_pkey" PRIMARY KEY ("id");


--
-- Name: comps comps_pkey; Type: CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."comps"
    ADD CONSTRAINT "comps_pkey" PRIMARY KEY ("id");


--
-- Name: divisions divisions_pkey; Type: CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."divisions"
    ADD CONSTRAINT "divisions_pkey" PRIMARY KEY ("id");


--
-- Name: rounds rounds_pkey; Type: CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."rounds"
    ADD CONSTRAINT "rounds_pkey" PRIMARY KEY ("id");


--
-- Name: climbs routes_pkey; Type: CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."climbs"
    ADD CONSTRAINT "routes_pkey" PRIMARY KEY ("id");


--
-- Name: advancements advancements_division_id_fkey; Type: FK CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."advancements"
    ADD CONSTRAINT "advancements_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "qdb_2022"."divisions"("id");


--
-- Name: advancements advancements_round_id_fkey; Type: FK CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."advancements"
    ADD CONSTRAINT "advancements_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "qdb_2022"."rounds"("id");


--
-- Name: attempts attempts_climb_id_fkey; Type: FK CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."attempts"
    ADD CONSTRAINT "attempts_climb_id_fkey" FOREIGN KEY ("climb_id") REFERENCES "qdb_2022"."climbs"("id");


--
-- Name: attempts attempts_competitor_id_fkey; Type: FK CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."attempts"
    ADD CONSTRAINT "attempts_competitor_id_fkey" FOREIGN KEY ("competitor_id") REFERENCES "qdb_2022"."competitors"("id");


--
-- Name: climbs climbs_round_id_fkey; Type: FK CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."climbs"
    ADD CONSTRAINT "climbs_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "qdb_2022"."rounds"("id");


--
-- Name: competitors competitors_advancement_id_fkey; Type: FK CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."competitors"
    ADD CONSTRAINT "competitors_advancement_id_fkey" FOREIGN KEY ("advancement_id") REFERENCES "qdb_2022"."advancements"("id");


--
-- Name: competitors competitors_division_id_fkey; Type: FK CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."competitors"
    ADD CONSTRAINT "competitors_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "qdb_2022"."divisions"("id");


--
-- Name: competitors competitors_id_fkey; Type: FK CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."competitors"
    ADD CONSTRAINT "competitors_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");


--
-- Name: divisions divisions_comp_id_fkey; Type: FK CONSTRAINT; Schema: qdb_2022; Owner: supabase_admin
--

ALTER TABLE ONLY "qdb_2022"."divisions"
    ADD CONSTRAINT "divisions_comp_id_fkey" FOREIGN KEY ("comp_id") REFERENCES "qdb_2022"."comps"("id");


--
-- Name: SCHEMA "qdb_2022"; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA "qdb_2022" TO "anon";
GRANT USAGE ON SCHEMA "qdb_2022" TO "authenticated";
GRANT USAGE ON SCHEMA "qdb_2022" TO "service_role";


--
-- Name: FUNCTION "algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea", "text"[], "text"[]); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "dashboard_user";


--
-- Name: FUNCTION "crypt"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "dearmor"("text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_bytes"(integer); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_uuid"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text", integer); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "dashboard_user";


--
-- Name: FUNCTION "pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_key_id"("bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "sign"("payload" "json", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "try_cast_double"("inp" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_decode"("data" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_encode"("data" "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1mc"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v3"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v4"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v5"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_nil"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_dns"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_oid"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_url"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_x500"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "dashboard_user";


--
-- Name: FUNCTION "verify"("token" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "get_built_schema_version"(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "graphql"."get_built_schema_version"() TO "postgres";
GRANT ALL ON FUNCTION "graphql"."get_built_schema_version"() TO "anon";
GRANT ALL ON FUNCTION "graphql"."get_built_schema_version"() TO "authenticated";
GRANT ALL ON FUNCTION "graphql"."get_built_schema_version"() TO "service_role";


--
-- Name: FUNCTION "rebuild_on_ddl"(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "graphql"."rebuild_on_ddl"() TO "postgres";
GRANT ALL ON FUNCTION "graphql"."rebuild_on_ddl"() TO "anon";
GRANT ALL ON FUNCTION "graphql"."rebuild_on_ddl"() TO "authenticated";
GRANT ALL ON FUNCTION "graphql"."rebuild_on_ddl"() TO "service_role";


--
-- Name: FUNCTION "rebuild_on_drop"(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "graphql"."rebuild_on_drop"() TO "postgres";
GRANT ALL ON FUNCTION "graphql"."rebuild_on_drop"() TO "anon";
GRANT ALL ON FUNCTION "graphql"."rebuild_on_drop"() TO "authenticated";
GRANT ALL ON FUNCTION "graphql"."rebuild_on_drop"() TO "service_role";


--
-- Name: FUNCTION "rebuild_schema"(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "graphql"."rebuild_schema"() TO "postgres";
GRANT ALL ON FUNCTION "graphql"."rebuild_schema"() TO "anon";
GRANT ALL ON FUNCTION "graphql"."rebuild_schema"() TO "authenticated";
GRANT ALL ON FUNCTION "graphql"."rebuild_schema"() TO "service_role";


--
-- Name: FUNCTION "variable_definitions_sort"("variable_definitions" "jsonb"); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "graphql"."variable_definitions_sort"("variable_definitions" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "graphql"."variable_definitions_sort"("variable_definitions" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "graphql"."variable_definitions_sort"("variable_definitions" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "graphql"."variable_definitions_sort"("variable_definitions" "jsonb") TO "service_role";


--
-- Name: FUNCTION "graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb"); Type: ACL; Schema: graphql_qdb_2022; Owner: supabase_admin
--

-- GRANT ALL ON FUNCTION "graphql_qdb_2022"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "postgres";
-- GRANT ALL ON FUNCTION "graphql_qdb_2022"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "anon";
-- GRANT ALL ON FUNCTION "graphql_qdb_2022"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "authenticated";
-- GRANT ALL ON FUNCTION "graphql_qdb_2022"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "service_role";


--
-- Name: SEQUENCE "key_key_id_seq"; Type: ACL; Schema: pgsodium; Owner: postgres
--

GRANT ALL ON SEQUENCE "pgsodium"."key_key_id_seq" TO "pgsodium_keyiduser";


--
-- Name: TABLE "pg_stat_statements"; Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "dashboard_user";


--
-- Name: TABLE "pg_stat_statements_info"; Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "dashboard_user";


--
-- Name: TABLE "schema_version"; Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON TABLE "graphql"."schema_version" TO "postgres";
GRANT ALL ON TABLE "graphql"."schema_version" TO "anon";
GRANT ALL ON TABLE "graphql"."schema_version" TO "authenticated";
GRANT ALL ON TABLE "graphql"."schema_version" TO "service_role";


--
-- Name: SEQUENCE "seq_schema_version"; Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "postgres";
GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "anon";
GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "authenticated";
GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "service_role";


--
-- Name: TABLE "valid_key"; Type: ACL; Schema: pgsodium; Owner: postgres
--

GRANT ALL ON TABLE "pgsodium"."valid_key" TO "pgsodium_keyiduser";


--
-- Name: TABLE "advancements"; Type: ACL; Schema: qdb_2022; Owner: supabase_admin
--

GRANT ALL ON TABLE "qdb_2022"."advancements" TO "postgres";
GRANT ALL ON TABLE "qdb_2022"."advancements" TO "anon";
GRANT ALL ON TABLE "qdb_2022"."advancements" TO "authenticated";
GRANT ALL ON TABLE "qdb_2022"."advancements" TO "service_role";


--
-- Name: TABLE "attempts"; Type: ACL; Schema: qdb_2022; Owner: supabase_admin
--

GRANT ALL ON TABLE "qdb_2022"."attempts" TO "postgres";
GRANT ALL ON TABLE "qdb_2022"."attempts" TO "anon";
GRANT ALL ON TABLE "qdb_2022"."attempts" TO "authenticated";
GRANT ALL ON TABLE "qdb_2022"."attempts" TO "service_role";


--
-- Name: TABLE "climbs"; Type: ACL; Schema: qdb_2022; Owner: supabase_admin
--

GRANT ALL ON TABLE "qdb_2022"."climbs" TO "postgres";
GRANT ALL ON TABLE "qdb_2022"."climbs" TO "anon";
GRANT ALL ON TABLE "qdb_2022"."climbs" TO "authenticated";
GRANT ALL ON TABLE "qdb_2022"."climbs" TO "service_role";


--
-- Name: TABLE "competitors"; Type: ACL; Schema: qdb_2022; Owner: supabase_admin
--

GRANT ALL ON TABLE "qdb_2022"."competitors" TO "postgres";
GRANT ALL ON TABLE "qdb_2022"."competitors" TO "anon";
GRANT ALL ON TABLE "qdb_2022"."competitors" TO "authenticated";
GRANT ALL ON TABLE "qdb_2022"."competitors" TO "service_role";


--
-- Name: TABLE "comps"; Type: ACL; Schema: qdb_2022; Owner: supabase_admin
--

GRANT ALL ON TABLE "qdb_2022"."comps" TO "postgres";
GRANT ALL ON TABLE "qdb_2022"."comps" TO "anon";
GRANT ALL ON TABLE "qdb_2022"."comps" TO "authenticated";
GRANT ALL ON TABLE "qdb_2022"."comps" TO "service_role";


--
-- Name: TABLE "divisions"; Type: ACL; Schema: qdb_2022; Owner: supabase_admin
--

GRANT ALL ON TABLE "qdb_2022"."divisions" TO "postgres";
GRANT ALL ON TABLE "qdb_2022"."divisions" TO "anon";
GRANT ALL ON TABLE "qdb_2022"."divisions" TO "authenticated";
GRANT ALL ON TABLE "qdb_2022"."divisions" TO "service_role";


--
-- Name: TABLE "rounds"; Type: ACL; Schema: qdb_2022; Owner: supabase_admin
--

GRANT ALL ON TABLE "qdb_2022"."rounds" TO "postgres";
GRANT ALL ON TABLE "qdb_2022"."rounds" TO "anon";
GRANT ALL ON TABLE "qdb_2022"."rounds" TO "authenticated";
GRANT ALL ON TABLE "qdb_2022"."rounds" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: qdb_2022; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "qdb_2022" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "qdb_2022" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "qdb_2022" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "qdb_2022" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: qdb_2022; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "qdb_2022" GRANT ALL ON SEQUENCES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "qdb_2022" GRANT ALL ON SEQUENCES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "qdb_2022" GRANT ALL ON SEQUENCES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "qdb_2022" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: qdb_2022; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "qdb_2022" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "qdb_2022" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "qdb_2022" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "qdb_2022" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: qdb_2022; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "qdb_2022" GRANT ALL ON FUNCTIONS  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "qdb_2022" GRANT ALL ON FUNCTIONS  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "qdb_2022" GRANT ALL ON FUNCTIONS  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "qdb_2022" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: qdb_2022; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "qdb_2022" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "qdb_2022" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "qdb_2022" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "qdb_2022" GRANT ALL ON TABLES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: qdb_2022; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "qdb_2022" GRANT ALL ON TABLES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "qdb_2022" GRANT ALL ON TABLES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "qdb_2022" GRANT ALL ON TABLES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "qdb_2022" GRANT ALL ON TABLES  TO "service_role";


--
-- PostgreSQL database dump complete
--

RESET ALL;
