import {
  getSupabase,
  type TypedSupabaseClient,
} from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

const getProblem = (formData: FormData) => {
  const problem = formData.get('problem')?.toString()
  if (!problem) throw new Error('Invalid problem')
  return problem
}

const record = async (
  supabaseClient: TypedSupabaseClient,
  team: string,
  problem: string,
  type: 'top' | 'flash' | null,
) => {
  if (type === null) {
    const { error } = await supabaseClient
      .from('qualis')
      .delete()
      .eq('team_id', team)
      .eq('problem_id', problem)
    if (error) {
      throw error
    }
    return
  }
  const { error } = await supabaseClient
    .from('qualis')
    .upsert({
      team_id: team,
      problem_id: problem,
      is_top: type === 'top',
      is_flash: type === 'flash',
    })
    .select()
  if (error) {
    throw redirect(303, '/login')
  }
}

export const actions = {
  top: async (event) => {
    const { supabaseClient } = await getSupabase(event)
    const problem = getProblem(await event.request.formData())
    await record(supabaseClient, event.params.team, problem, 'top')
  },
  flash: async (event) => {
    const { supabaseClient } = await getSupabase(event)
    const problem = getProblem(await event.request.formData())
    await record(supabaseClient, event.params.team, problem, 'flash')
  },
  clear: async (event) => {
    const { supabaseClient } = await getSupabase(event)
    const problem = getProblem(await event.request.formData())
    await record(supabaseClient, event.params.team, problem, null)
  },
} satisfies Actions
