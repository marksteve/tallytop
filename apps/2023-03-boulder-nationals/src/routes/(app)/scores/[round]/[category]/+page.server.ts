import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

const nextRounds = {
  qualis: {
    inter_m: 'finals',
    inter_w: 'finals',
    open_m: 'semis',
    open_w: 'finals'
  },
  semis: {
    open_m: 'finals'
  },
  finals: {}
}

export const load = (async ({ params }) => {
  return {
    nextRound: nextRounds[params.round][params.category]
  }
}) satisfies PageServerLoad

export const actions = {
  default: async ({ request, params, locals: { supabase } }) => {
    const formData = await request.formData()
    const cutoff = Number(formData.get('cutoff'))
    const nextRound = nextRounds[params.round][params.category]
    const { data: scores } = await supabase
      .from('scores')
      .select('round, category, competitor_id')
      .eq('round', params.round)
      .eq('category', params.category)
      .limit(cutoff)
    const startlists = scores?.reverse().map((startlist, i) => ({
      ...startlist,
      round: nextRound,
      order: i + 1
    }))
    const { error } = await supabase.from('startlists').insert(startlists)
    if (error) {
      return fail(400, { error: error.message })
    }
    throw redirect(303, `/judge/${nextRound}/${params.category}`)
  }
} satisfies Actions
