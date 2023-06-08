import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  return {
    cutoffs: {
      qualis: {
        inter_m: 6,
        inter_w: 6,
        open_m: 20,
        open_w: 6,
      },
      semis: {
        open_m: 6,
      },
      finals: {
        inter_m: 3,
        inter_w: 3,
        open_m: 3,
        open_w: 3,
      },
    },
    ...(await getSupabase(event)),
  }
}
