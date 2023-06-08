import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions = {
  default: async (event) => {
    const { supabaseClient } = await getSupabase(event)
    const formData = await event.request.formData()
    const attempts = formData.get('attempts')?.toString() ?? ''
    const top = attempts.indexOf('t') + 1
    const zone = attempts.indexOf('z') + 1 || top
    const { error } = await supabaseClient.from('climbs').upsert({
      competitor_id: event.params.competitor_id,
      problem_id: event.params.problem_id,
      attempts,
      top,
      zone,
    })
    if (error) {
      return fail(400, { error: error.message })
    }
  },
} satisfies Actions
