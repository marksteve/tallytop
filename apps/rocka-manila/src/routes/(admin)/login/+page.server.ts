import type { Actions } from './$types'
import { env } from '$env/dynamic/private'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = Object.fromEntries(await request.formData())
    if (env.SYNC_TOKEN !== data.password) {
      return fail(400, { error: 'Invalid password' })
    }
    cookies.set('token', data.password)
    throw redirect(301, '/admin')
  },
}
