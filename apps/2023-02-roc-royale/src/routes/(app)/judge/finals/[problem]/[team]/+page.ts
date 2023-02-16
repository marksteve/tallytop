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
  return {
    title: ['Judge/\nFinals', 'rotate-3'],
    problem,
    team
  }
}) satisfies PageLoad
