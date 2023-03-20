import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { LayoutLoad } from './$types'

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

export const load: LayoutLoad = async (event) => {
  const { supabaseClient } = await getSupabase(event)
  return {
    competitors: await getCompetitors(supabaseClient, event.params)
  }
}
