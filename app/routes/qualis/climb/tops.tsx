import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ascending } from 'd3-array'
import { loadUser, requireSignIn } from '~/loaders'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const shouldRedirect = await requireSignIn(request)
  if (shouldRedirect) {
    return shouldRedirect
  }

  const supabase = serverClient(request)
  const user = await loadUser(supabase)

  const { data: tops } = await supabase
    .from('qualis_tops_with_climbs')
    .select('climb_name, score, is_flash')
    .eq('competitor_id', user.id)

  const score = tops?.reduce(
    (total, { score, is_flash }) =>
      total +
      score * (is_flash ? parseFloat(process.env.QUALIS_FLASH_MULTIPLIER) : 1),
    0
  )

  return json({ tops, score })
}

export default function Tops() {
  const { tops, score } = useLoaderData()

  return (
    <div className="flex flex-1 flex-col items-center justify-around">
      <div className="flex flex-col items-center gap-5 p-10">
        <div className="text-2xl text-red">Your Tops</div>
        <div className="flex flex-wrap items-center justify-center gap-10 p-10">
          {tops
            .sort((a, b) =>
              ascending(parseFloat(a.climb_name), parseFloat(b.climb_name))
            )
            .map((top) => (
              <div
                key={top.climb_name}
                className="flex flex-col items-center gap-5"
              >
                <div className="climb-number">{top.climb_name}</div>
                <div className="text-2xl">
                  {top.score}
                  <span className="text-lg text-yellow">
                    {top.is_flash ? ' x 2' : ''}
                  </span>
                </div>
              </div>
            ))}
        </div>
        <div className="text-2xl text-red">Your Points</div>
        <div className="text-6xl">{score}</div>
      </div>
    </div>
  )
}
