import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: problem } = await supabaseClient
    .from('finals_problems')
    .select()
    .eq('id', event.params.problem)
    .single()
  const { data: team } = await supabaseClient
    .from('teams')
    .select()
    .eq('id', event.params.team)
    .single()
  const { data: results } = await supabaseClient
    .from('finals')
    .select()
    .eq('team_id', event.params.team)
    .eq('problem_id', event.params.problem)
    .maybeSingle()
  return {
    title: ['Judge/\nFinals', 'rotate-3'],
    problem,
    team,
    attempts: results?.attempts,
  }
}) satisfies PageLoad
