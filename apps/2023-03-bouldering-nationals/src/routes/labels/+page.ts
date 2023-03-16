import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: competitors } = await supabaseClient.from('competitors').select()
  return {
    competitors: competitors ?? []
  }
}) satisfies PageLoad
