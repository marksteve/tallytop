import type { PageLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: problems } = await supabaseClient
    .from('problems')
    .select()
    .eq('round', event.params.round)
    .eq('category', event.params.category)
  return {
    title: 'JUDGE',
    params: event.params,
    problems: problems ?? [],
  }
}) satisfies PageLoad
