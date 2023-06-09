import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: competitors } = await supabaseClient
    .from('competitors')
    .select()
    .eq('competition', '2023-03-boulder-nationals')
  return {
    competitors: competitors ?? [],
  }
}) satisfies PageLoad
