import { nextRounds } from '$lib/flows'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const nextRound = nextRounds[event.params.round][event.params.category]
  const { supabaseClient } = await getSupabase(event)
  const { data: scores } = await supabaseClient
    .from('scores')
    .select()
    .eq('round', event.params.round)
    .eq('category', event.params.category)
  const { count: nextCount } = await supabaseClient
    .from('scores')
    .select('*', { count: 'exact', head: true })
    .eq('round', nextRound)
    .eq('category', event.params.category)
  event.depends([event.params.round, event.params.category].join(':'))
  return {
    title: 'SCORES',
    nextRound,
    scores: scores ?? [],
    nextHasStartlist: nextCount! > 0
  }
}) satisfies PageLoad
