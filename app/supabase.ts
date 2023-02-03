import { Response } from '@remix-run/node'
import {
  createBrowserClient,
  createServerClient,
} from '@supabase/auth-helpers-remix'
import type { Database } from '~/database.types'

export const getClientEnv = (env) =>
  [env.SUPABASE_URL, env.SUPABASE_ANON_KEY] as const

export const serverClient = (
  request: globalThis.Request,
  response: globalThis.Response | null = null
) => {
  const [url, key] = getClientEnv(process.env)
  return createServerClient<Database, 'qdb_2022'>(url, key, {
    request,
    response: response ?? new Response(),
    options: { db: { schema: 'qdb_2022' } },
  })
}

export const browserClient = (url, key) => {
  return createBrowserClient<Database, 'qdb_2022'>(url, key, {
    options: { db: { schema: 'qdb_2022' } },
  })
}
