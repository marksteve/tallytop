import { Response } from '@remix-run/node'
import {
  createBrowserClient,
  createServerClient,
} from '@supabase/auth-helpers-remix'
import type { Database } from '~/database.types'

export const getClientEnv = (env) =>
  [env.SUPABASE_URL, env.SUPABASE_ANON_KEY] as const

export const serverClient = (
  request: Request,
  response: Response | null = null
) => {
  const [url, key] = getClientEnv(process.env)
  return createServerClient<Database>(url, key, {
    request,
    response: response ?? new Response(),
  })
}

export const browserClient = (env) => {
  const [url, key] = getClientEnv(env)
  return createBrowserClient<Database>(url, key)
}
