import { json, type LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { requireSignIn } from '~/loaders'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const shouldRedirect = await requireSignIn(request)
  if (shouldRedirect) {
    return shouldRedirect
  }

  const supabase = serverClient(request)
  const { data: climbs } = await supabase
    .from('climbs')
    .select()
    .eq('round_id', process.env.FINALS_ID)

  return json({ climbs })
}

export default function Boulders() {
  const { climbs } = useLoaderData()
  return (
    <div className="flex flex-1 flex-col items-center gap-10 p-10">
      <h2 className="text-6xl">Finals Boulders</h2>
      <div className="flex max-w-screen-sm flex-wrap items-center justify-center gap-5 text-4xl">
        {climbs.map((climb) => (
          <Link
            key={climb.id}
            to={`/finals/boulders/${climb.id}`}
            className="button w-1/4 text-center"
          >
            {climb.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
