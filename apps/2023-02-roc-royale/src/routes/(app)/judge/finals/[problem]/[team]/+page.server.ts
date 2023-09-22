import {
  getSupabase,
  type TypedSupabaseClient,
} from '@supabase/auth-helpers-sveltekit'
import type { Actions } from './$types'

export const actions = {
  default: async (event) => {
    const { supabaseClient } = await getSupabase(event)
    const formData = await event.request.formData()
    const attempts = formData.get('attempts')?.toString() ?? ''
    const top = attempts.indexOf('t') + 1
    const zone = attempts.indexOf('z') + 1 || top
    await supabaseClient.from('finals').upsert({
      team_id: event.params.team,
      problem_id: event.params.problem,
      attempts,
      top,
      zone,
    })
  },
} satisfies Actions
