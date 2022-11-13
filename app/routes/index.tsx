import { json, type LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { loadSession, loadUser } from '~/loaders'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response()
  const client = serverClient(request, response)
  const session = await loadSession(client)
  const user = await loadUser(client)
  return json({ session, user }, { headers: response.headers })
}

export default function Index() {
  const { session, user } = useLoaderData()
  return (
    <div>
      {session ? (
        `Hello ${user.email}`
      ) : (
        <Link to="/sign-in">Sign in</Link>
      )}
    </div>
  )
}
