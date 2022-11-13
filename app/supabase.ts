import {
  createBrowserClient,
  createServerClient,
} from '@supabase/auth-helpers-remix'
import type { Database } from '~/database.types'

export const getClientEnv = (env) =>
  [env.SUPABASE_URL, env.SUPABASE_ANON_KEY] as const

export const serverClient = (request, response) => {
  const [url, key] = getClientEnv(process.env)
  return createServerClient<Database>(url, key, { request, response })
}

export const browserClient = (env) => {
  const [url, key] = getClientEnv(env)
  return createBrowserClient<Database>(url, key)
}
