import type { LinksFunction, MetaFunction } from '@remix-run/node'
import Snowfall from 'react-snowfall'
import { json, type LoaderFunction } from '@remix-run/node'
import { Cloud, CloudSnow } from 'lucide-react'
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
  useTransition,
} from '@remix-run/react'
import { loadUser } from '~/loaders'
import styles from '~/styles/app.css'
import { browserClient, getClientEnv, serverClient } from '~/supabase'
import { useEffect, useState } from 'react'
import Loading from './components/loading'

export const links: LinksFunction = () => [
  { rel: 'icon', href: '/images/favicon.svg', type: 'image/svg+xml' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Dekko&family=Oleo+Script&family=Roboto+Mono&display=swap',
  },
  { rel: 'stylesheet', href: styles },
]

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Queso de Boulder 2022',
  description: `A BHive Pamaskomp! Feeling inspired after Asian Cup Manila? Now's your chance to show what you're made of at our yearly Christmas fun comp!`,
  'og:image': '/images/og-image.webp',
  viewport: 'width=device-width,initial-scale=1',
})

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = serverClient(request)
  const user = await loadUser(supabase)
  return json({ clientEnv: getClientEnv(process.env), user })
}

export default function App() {
  const { clientEnv, user } = useLoaderData()
  const { pathname } = useLocation()
  const transition = useTransition()
  const [snowVisible, setSnowVisible] = useState(false)
  const supabase = browserClient(...clientEnv)

  useEffect(() => {
    setSnowVisible(localStorage.getItem('qdb-snow') !== 'false')
  }, [])

  const handleToggleSnow = () => {
    localStorage.setItem('qdb-snow', snowVisible ? 'false' : 'true')
    setSnowVisible(!snowVisible)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  const SnowButtonIcon = snowVisible ? CloudSnow : Cloud

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {pathname.startsWith('/labels') ? (
          <Outlet />
        ) : (
          <main
            className={`relative flex h-screen w-screen flex-col overflow-x-hidden bg-teal`}
          >
            <button
              className="absolute top-5 left-5 text-white"
              onClick={handleToggleSnow}
            >
              <SnowButtonIcon size={32} />
            </button>
            {snowVisible ? (
              <Snowfall
                color="rgba(255, 255, 255, 0.8)"
                snowflakeCount={100}
                radius={[2, 6]}
              />
            ) : null}
            <header className="flex flex-col items-center gap-2 p-5">
              <Link to="/">
                <h1 className="flex items-center">
                  <div className="font-cursive leading-[0.5em]">
                    <span className="text-4xl text-yellow">Queso</span>
                    <br />
                    <span className="pl-7 text-white">de Boulder</span>
                  </div>
                  <img src="/images/qdb-logo.svg" alt="Queso" width="72" />
                </h1>
              </Link>
              {pathname === '/finals/timer' ? null : (
                <>
                  {user ? (
                    user.user_metadata.name
                  ) : (
                    <Link to="/sign-in" className="button px-2 py-1 text-sm">
                      Sign in
                    </Link>
                  )}
                  {user ? (
                    <button
                      className="button px-2 py-1 text-sm"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  ) : null}
                </>
              )}
            </header>
            <Outlet />
            {transition.state !== 'idle' ? <Loading /> : null}
          </main>
        )}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
