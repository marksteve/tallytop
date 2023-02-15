import type { PageLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: teams } = await supabaseClient.from('teams').select()
  return {
    title: ['Judge/\nQualis', 'rotate-3'],
    teams
  }
}) satisfies PageLoad
