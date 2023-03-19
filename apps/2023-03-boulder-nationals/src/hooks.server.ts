import '$lib/supabase'

import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle = (async ({ event, resolve }) => {
  const { supabaseClient, session } = await getSupabase(event)
  if (!session && event.url.pathname.startsWith('/judge')) {
    throw redirect(303, '/login')
  }
  event.locals.supabase = supabaseClient
  return resolve(event)
}) satisfies Handle
