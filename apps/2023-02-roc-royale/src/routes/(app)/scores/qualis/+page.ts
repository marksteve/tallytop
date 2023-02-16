import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: scores } = await supabaseClient.from('qualis_scores').select()
  return {
    title: ['Score/\nQualis', 'rotate-3'],
    scores: scores ?? []
  }
}) satisfies PageLoad
