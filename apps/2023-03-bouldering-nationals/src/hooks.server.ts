import '$lib/supabase'

import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle = (async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/judge')) {
    const { session } = await getSupabase(event)
    if (!session) {
      throw redirect(303, '/login')
    }
  }
  return resolve(event)
}) satisfies Handle
