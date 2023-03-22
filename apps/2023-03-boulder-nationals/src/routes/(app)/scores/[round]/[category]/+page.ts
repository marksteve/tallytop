import type { PageLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: scores } = await supabaseClient
    .from('scores')
    .select()
    .eq('round', event.params.round)
    .eq('category', event.params.category)
  return {
    title: 'SCORES',
    scores: scores ?? []
  }
}) satisfies PageLoad
