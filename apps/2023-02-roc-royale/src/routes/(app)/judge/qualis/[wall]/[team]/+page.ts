import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'

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
  return {
    title: ['Judge/\nQualis', 'rotate-3'],
    problems,
    team
  }
}) satisfies PageLoad
