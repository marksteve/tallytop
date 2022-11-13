import { json, type LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { loadSession, loadUser } from '~/loaders'
import { browserClient, serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response()
  const supabase = serverClient(request, response)
  const session = await loadSession(supabase)
  const user = await loadUser(supabase)
  return json(
    { env: process.env, session, user },
    { headers: response.headers }
  )
}

export default function Index() {
  const { env, session, user } = useLoaderData()
  const supabase = browserClient(env)
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    location.reload()
  }
  return (
    <div className="flex-1 p-10">
      <header className="flex justify-between">
        {session ? `Hello ${user.email}` : <Link to="/sign-in">Sign in</Link>}
        {session ? (
          <button className="button bg-black" onClick={handleSignOut}>
            Sign out
          </button>
        ) : null}
      </header>
    </div>
  )
}
