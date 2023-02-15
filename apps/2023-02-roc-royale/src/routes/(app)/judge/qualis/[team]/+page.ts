import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import * as R from 'ramda'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: team } = await supabaseClient
    .from('teams')
    .select()
    .eq('id', event.params.team)
    .single()
  const { data: problems } = await supabaseClient.from('problems').select()
  const problemsByWall = R.groupBy((p) => p.wall, problems ?? [])
  return {
    title: ['Judge/\nQualis', 'rotate-3'],
    team,
    problems: Object.entries(problemsByWall)
  }
}) satisfies PageLoad
