import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: teams } = await supabaseClient.from('teams').select().order('created_at')
  const { data: problem } = await supabaseClient
    .from('finals_problems')
    .select()
    .eq('id', event.params.problem)
    .single()
  return {
    title: ['Judge/\nFinals', 'rotate-3'],
    teams: teams ?? [],
    problem
  }
}) satisfies PageLoad
