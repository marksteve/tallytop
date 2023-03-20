import type { PageLoad } from './$types'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

const getCompetitors = async (supabaseClient, params) => {
  if (params.category.startsWith('inter_') && params.round === 'qualis') {
    const { data: competitors } = await supabaseClient
      .from('competitors')
      .select()
      .eq('category', params.category)
      .order('last_name')
    return competitors
  } else {
    const { data: competitors } = await supabaseClient
      .from('startlists')
      .select('...competitors(*), order')
      .eq('category', params.category)
      .order('order')
    return competitors
  }
}

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const competitors = getCompetitors(supabaseClient, event.params)
  return {
    title: 'JUDGE',
    params: event.params,
    competitors: competitors ?? []
  }
}) satisfies PageLoad
