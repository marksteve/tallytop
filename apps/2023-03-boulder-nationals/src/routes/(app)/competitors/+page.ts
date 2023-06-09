import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import * as R from 'ramda'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: competitors } = await supabaseClient
    .from('competitors')
    .select()
    .eq('competition', '2023-03-boulder-nationals')

  return {
    title: 'COMPETITORS',
    competitors: R.zipObj(R.map(R.prop('id'), competitors), competitors),
  }
}) satisfies PageLoad
