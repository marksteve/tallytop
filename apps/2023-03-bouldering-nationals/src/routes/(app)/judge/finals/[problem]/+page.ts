import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: teams } = await supabaseClient
    .from('qualis_scores')
    .select()
    .order('score', { ascending: false })
    .limit(6)
  const { data: problem } = await supabaseClient
    .from('finals_problems')
    .select()
    .eq('id', event.params.problem)
    .single()
  return {
    teams: teams?.reverse() ?? [],
    problem
  }
}) satisfies PageLoad
