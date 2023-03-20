import type { PageLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: competitors } = await supabaseClient
    .from('competitors')
    .select()
    .eq('category', event.params.category)
  return {
    title: 'JUDGE',
    params: event.params,
    competitors: competitors ?? []
  }
}) satisfies PageLoad
