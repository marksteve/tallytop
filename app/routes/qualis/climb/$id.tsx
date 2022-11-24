import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { requireSignIn } from '~/loaders'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request, params }) => {
  const shouldRedirect = await requireSignIn(request)
  if (shouldRedirect) {
    return shouldRedirect
  }

  const supabase = serverClient(request)
  const { data: climb, error } = await supabase
    .from('climbs')
    .select(
      `
      *,
      attempts(id)
    `
    )
    .eq('id', params['id'])
    .single()
  if (error) {
    throw error
  }

  return json({ climb })
}

export default function Climb() {
  const { climb } = useLoaderData()
  return (
    <div className="flex flex-1 flex-col items-center justify-around">
      <div className="climb-number">{climb.name}</div>
      <div className="flex gap-5 text-4xl">
        <button className="button">Flash</button>
        <button className="button bg-black">Top</button>
      </div>
    </div>
  )
}
