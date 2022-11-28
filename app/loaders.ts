import { redirect } from '@remix-run/node'
import { serverClient } from '~/supabase'

export async function requireSignIn(request) {
  const supabase = serverClient(request, new Response())
  const session = await loadSession(supabase)
  if (!session) {
    const params = new URLSearchParams()
    params.set('redirectTo', request.url)
    return redirect(`/sign-in?${params}`)
  }
}

export async function loadSession(supabase) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function loadUser(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
