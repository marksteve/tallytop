import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: teams } = await supabaseClient.from('teams').select().order('created_at')
  return {
    title: ['Judge/\nQualis', 'rotate-3'],
    teams: teams ?? [],
    wall: event.params.wall
  }
}) satisfies PageLoad
