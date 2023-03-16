import type { PageLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: problems } = await supabaseClient.from('finals_problems').select().order('wall')
  return {
    problems: problems ?? []
  }
}) satisfies PageLoad
