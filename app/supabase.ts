import { createServerClient } from '@supabase/auth-helpers-remix'
import type { Database } from '~/database.types'

export const serverClient = (request, response) =>
  createServerClient<Database>(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      request,
      response,
    }
  )
