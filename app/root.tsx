import type { MetaFunction } from '@remix-run/node'
import { json, type LoaderFunction } from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { loadUser } from '~/loaders'
import styles from '~/styles/app.css'
import { browserClient, serverClient } from '~/supabase'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Tallytop',
  viewport: 'width=device-width,initial-scale=1',
})

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response()
  const supabase = serverClient(request, response)
  const user = await loadUser(supabase)
  return json({ env: process.env, user })
}

export default function App() {
  const { env, user } = useLoaderData()
  const supabase = browserClient(env)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="h-screen w-screen overflow-x-hidden">
          <header className="flex items-center gap-2 bg-slate-500 p-2 text-white">
            <h1 className="flex-1 font-bold">Tallytop</h1>
            {user ? `Hello ${user.email}` : <Link to="/sign-in">Sign in</Link>}
            {user ? (
              <button
                className="button px-2 py-1 text-sm"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            ) : null}
          </header>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
