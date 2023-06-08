import type { PageLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: problems } = await supabaseClient
    .from('qualis_problems')
    .select('wall')
    .order('wall')
  const walls = Array.from(new Set(problems?.map((p) => p.wall)))
  return {
    title: ['Judge/\nQualis', 'rotate-3'],
    walls,
  }
}) satisfies PageLoad
