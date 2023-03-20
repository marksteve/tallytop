import { categories } from '$lib/labels'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const load = (async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { data: problem } = await supabaseClient
    .from('problems')
    .select()
    .eq('id', event.params.problem_id)
    .single()
  const { data: competitor } = await supabaseClient
    .from('competitors')
    .select()
    .eq('id', event.params.competitor_id)
    .single()
  const { data: climbs } = await supabaseClient
    .from('climbs')
    .select()
    .eq('competitor_id', event.params.competitor_id)
    .eq('problem_id', event.params.problem_id)
    .maybeSingle()
  if (problem?.category !== competitor?.category) {
    throw error(403, {
      message: `${competitor?.first_name} ${competitor?.last_name} doesn't belong to ${
        categories[problem?.category ?? '']
      }`
    })
  }
  return {
    title: 'JUDGE',
    problem,
    competitor,
    attempts: climbs?.attempts
  }
}) satisfies PageLoad
