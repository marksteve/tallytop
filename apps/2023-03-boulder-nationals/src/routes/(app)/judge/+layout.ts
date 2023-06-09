import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  const { supabaseClient } = await getSupabase(event)
  const { params } = event
  if (params.round && params.category) {
    const { data: problems } = await supabaseClient
      .from('problems')
      .select()
      .eq('competition', '2023-03-boulder-nationals')
      .eq('round', params.round)
      .eq('category', params.category)
    return {
      problems: problems?.map((problem) => [problem.id, problem.wall]),
    }
  }
}
