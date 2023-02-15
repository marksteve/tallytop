import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'
import * as R from 'ramda'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: problems } = await supabaseClient
    .from('problems')
    .select()
    .eq('wall', event.params.wall)
  const { data: team } = await supabaseClient
    .from('teams')
    .select()
    .eq('id', event.params.team)
    .single()
  const { data: results } = await supabaseClient
    .from('qualis')
    .select('*, problems(id, wall)')
    .eq('team_id', event.params.team)
    .eq('problems.wall', event.params.wall)
  const resultsByProblem = R.fromPairs(results?.map((r) => [r?.problems?.id, r]))
  return {
    title: ['Judge/\nQualis', 'rotate-3'],
    wall: event.params.wall,
    problems: problems ?? [],
    team,
    results: resultsByProblem
  }
}) satisfies PageLoad
