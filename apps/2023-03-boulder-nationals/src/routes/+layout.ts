import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  const { supabaseClient, session } = await getSupabase(event)
  return { supabase: supabaseClient, session }
}
