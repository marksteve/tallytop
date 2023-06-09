import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: scores } = await supabaseClient
    .from('scores')
    .select()
    .eq('competition', '2023-03-boulder-nationals')
    .eq('round', event.params.round)
    .eq('category', event.params.category)
  return {
    scores: scores ?? [],
  }
}) satisfies PageLoad
