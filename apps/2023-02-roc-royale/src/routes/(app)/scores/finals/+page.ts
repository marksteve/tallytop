import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: scores } = await supabaseClient.from('finals_scores').select()
  return {
    title: ['Scores/\nFinals', '-rotate-2'],
    scores: scores ?? [],
  }
}) satisfies PageLoad
