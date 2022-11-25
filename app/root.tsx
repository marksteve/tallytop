import type { LinksFunction, MetaFunction } from '@remix-run/node'
import Snowfall from 'react-snowfall'
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
  useLocation,
} from '@remix-run/react'
import { loadUser } from '~/loaders'
import styles from '~/styles/app.css'
import { browserClient, serverClient } from '~/supabase'

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/images/favicon.svg', type: 'image/svg+xml' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Oleo+Script&display=swap',
  },
  { rel: 'stylesheet', href: styles },
]

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Queso de Boulder 2022',
  viewport: 'width=device-width,initial-scale=1',
})

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = serverClient(request)
  const user = await loadUser(supabase)
  return json({ env: process.env, user })
}

export default function App() {
  const { env, user } = useLoaderData()
  const supabase = browserClient(env)
  const { pathname } = useLocation()

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
        <main className="relative flex h-screen w-screen flex-col overflow-x-hidden bg-teal">
          {pathname.startsWith('/labels') ? null : (
            <Snowfall
              color="rgba(255, 255, 255, 0.8)"
              snowflakeCount={100}
              radius={[2, 6]}
            />
          )}
          <header className="flex flex-col items-center gap-2 p-5">
            <h1 className="flex flex-1 items-center">
              <div className="font-cursive leading-[0.5em]">
                <span className="text-4xl text-yellow">Queso</span>
                <br />
                <span className="pl-7 text-white">de Boulder</span>
              </div>
              <img src="/images/qdb-logo.svg" alt="Queso" width="72" />
            </h1>
            {user ? user.email : <Link to="/sign-in">Sign in</Link>}
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
