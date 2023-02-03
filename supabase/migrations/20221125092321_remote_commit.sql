-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

REVOKE ALL ON TABLE qdb_2022.competitors FROM anon;
REVOKE ALL ON TABLE qdb_2022.competitors FROM authenticated;
REVOKE ALL ON TABLE qdb_2022.competitors FROM postgres;
REVOKE ALL ON TABLE qdb_2022.competitors FROM service_role;
REVOKE ALL ON TABLE qdb_2022.competitors FROM supabase_admin;
GRANT ALL ON TABLE qdb_2022.competitors TO supabase_admin;

GRANT ALL ON TABLE qdb_2022.competitors TO authenticated;

GRANT ALL ON TABLE qdb_2022.competitors TO anon;

GRANT ALL ON TABLE qdb_2022.competitors TO postgres;

GRANT ALL ON TABLE qdb_2022.competitors TO service_role;

REVOKE ALL ON TABLE qdb_2022.divisions FROM anon;
REVOKE ALL ON TABLE qdb_2022.divisions FROM authenticated;
REVOKE ALL ON TABLE qdb_2022.divisions FROM service_role;
REVOKE ALL ON TABLE qdb_2022.divisions FROM supabase_admin;
GRANT ALL ON TABLE qdb_2022.divisions TO anon;

GRANT ALL ON TABLE qdb_2022.divisions TO supabase_admin;

GRANT ALL ON TABLE qdb_2022.divisions TO authenticated;

GRANT ALL ON TABLE qdb_2022.divisions TO service_role;

REVOKE ALL ON TABLE qdb_2022.rounds FROM anon;
REVOKE ALL ON TABLE qdb_2022.rounds FROM authenticated;
REVOKE ALL ON TABLE qdb_2022.rounds FROM service_role;
REVOKE ALL ON TABLE qdb_2022.rounds FROM supabase_admin;
GRANT ALL ON TABLE qdb_2022.rounds TO anon;

GRANT ALL ON TABLE qdb_2022.rounds TO supabase_admin;

GRANT ALL ON TABLE qdb_2022.rounds TO authenticated;

GRANT ALL ON TABLE qdb_2022.rounds TO service_role;

REVOKE ALL ON TABLE qdb_2022.attempts FROM anon;
REVOKE ALL ON TABLE qdb_2022.attempts FROM authenticated;
REVOKE ALL ON TABLE qdb_2022.attempts FROM postgres;
REVOKE ALL ON TABLE qdb_2022.attempts FROM service_role;
REVOKE ALL ON TABLE qdb_2022.attempts FROM supabase_admin;
GRANT ALL ON TABLE qdb_2022.attempts TO anon;

GRANT ALL ON TABLE qdb_2022.attempts TO postgres;

GRANT ALL ON TABLE qdb_2022.attempts TO supabase_admin;

GRANT ALL ON TABLE qdb_2022.attempts TO authenticated;

GRANT ALL ON TABLE qdb_2022.attempts TO service_role;

ALTER TABLE IF EXISTS qdb_2022.attempts
    ADD COLUMN count bigint;

REVOKE ALL ON TABLE qdb_2022.advancements FROM anon;
REVOKE ALL ON TABLE qdb_2022.advancements FROM authenticated;
REVOKE ALL ON TABLE qdb_2022.advancements FROM postgres;
REVOKE ALL ON TABLE qdb_2022.advancements FROM service_role;
REVOKE ALL ON TABLE qdb_2022.advancements FROM supabase_admin;
GRANT ALL ON TABLE qdb_2022.advancements TO anon;

GRANT ALL ON TABLE qdb_2022.advancements TO postgres;

GRANT ALL ON TABLE qdb_2022.advancements TO supabase_admin;

GRANT ALL ON TABLE qdb_2022.advancements TO authenticated;

GRANT ALL ON TABLE qdb_2022.advancements TO service_role;

REVOKE ALL ON TABLE qdb_2022.climbs FROM anon;
REVOKE ALL ON TABLE qdb_2022.climbs FROM authenticated;
REVOKE ALL ON TABLE qdb_2022.climbs FROM service_role;
REVOKE ALL ON TABLE qdb_2022.climbs FROM supabase_admin;
GRANT ALL ON TABLE qdb_2022.climbs TO anon;

GRANT ALL ON TABLE qdb_2022.climbs TO supabase_admin;

GRANT ALL ON TABLE qdb_2022.climbs TO authenticated;

GRANT ALL ON TABLE qdb_2022.climbs TO service_role;

REVOKE ALL ON TABLE qdb_2022.comps FROM anon;
REVOKE ALL ON TABLE qdb_2022.comps FROM authenticated;
REVOKE ALL ON TABLE qdb_2022.comps FROM service_role;
REVOKE ALL ON TABLE qdb_2022.comps FROM supabase_admin;
GRANT ALL ON TABLE qdb_2022.comps TO anon;

GRANT ALL ON TABLE qdb_2022.comps TO supabase_admin;

GRANT ALL ON TABLE qdb_2022.comps TO authenticated;

GRANT ALL ON TABLE qdb_2022.comps TO service_role;
