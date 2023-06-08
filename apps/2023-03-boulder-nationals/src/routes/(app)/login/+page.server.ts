import { JUDGE_EMAIL } from '$env/static/private'
import { redirect, fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const password = formData.get('password')?.toString()
    if (!password) return fail(400, { error: 'Password is required' })
    const { error } = await supabase.auth.signInWithPassword({
      email: JUDGE_EMAIL,
      password,
    })
    if (error) {
      return fail(400, { error: 'Wrong password' })
    }
    throw redirect(303, '/judge')
  },
} satisfies Actions
