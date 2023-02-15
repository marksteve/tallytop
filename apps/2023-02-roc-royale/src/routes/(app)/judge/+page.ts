import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  let { data: problems } = await supabaseClient.from('problems').select('*')
  return {
    title: ['Judge', 'rotate-3'],
    problems
  }
}) satisfies PageLoad
