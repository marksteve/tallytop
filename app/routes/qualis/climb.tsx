import { json, redirect, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { loadSession } from '~/loaders'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response()
  const supabase = serverClient(request, response)
  const session = await loadSession(supabase)
  if (!session) {
    const params = new URLSearchParams()
    params.set('redirectTo', '/qualis/climb')
    return redirect(`/sign-in?${params}`)
  }

  return json({
    score: 100,
  })
}

export default function Climb() {
  const { score } = useLoaderData()
  return (
    <div className="flex flex-1 flex-col items-center justify-around">
      <label>
        <div className="button cursor-pointer bg-red text-4xl">CLIMB!</div>
        <input type="file" accept="image/*;capture=camera" className="hidden" />
      </label>
      <div className="flex flex-col gap-5">
        <div className="text-2xl text-red">Your Points</div>
        <div className="text-8xl">{score}</div>
      </div>
    </div>
  )
}
