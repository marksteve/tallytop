import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from '@remix-run/node'
import { useLoaderData, useNavigate, useSubmit } from '@remix-run/react'
import { loadUser, requireSignIn } from '~/loaders'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request, params }) => {
  const shouldRedirect = await requireSignIn(request)
  if (shouldRedirect) {
    return shouldRedirect
  }

  const supabase = serverClient(request)
  const user = await loadUser(supabase)
  const { data: competitor } = await supabase
    .from('competitors')
    .select('division_id')
    .eq('id', user.id)
    .single()
  const { data: climb } = await supabase
    .from('climbs')
    .select(`*, attempts(competitors(*))`)
    .eq('id', params['id'])
    .eq('attempts.competitors.division_id', competitor.division_id)
    .single()
  const { data: top } = await supabase
    .from('qualis_tops')
    .select(`is_flash`)
    .eq('climb_id', params['id'])
    .eq('competitor_id', user.id)
    .maybeSingle()
  const nextScore =
    parseFloat(process.env.QUALIS_MAX_SCORE) /
    Math.max(
      (climb?.attempts?.filter(({ competitors }) => !!competitors) ?? [])
        .length + 1,
      1
    )

  return json({ climb, top, nextScore })
}

export const action: ActionFunction = async ({ request, params }) => {
  const supabase = serverClient(request)
  const user = await loadUser(supabase)
  const formData = await request.formData()
  if (formData.get('clear')) {
    await supabase
      .from('attempts')
      .delete()
      .eq('competitor_id', user.id)
      .eq('climb_id', params['id'])
    return redirect('/qualis/climb')
  }
  const { error } = await supabase
    .from('attempts')
    .upsert({
      competitor_id: user.id,
      climb_id: params['id'] ?? '',
      is_top: true,
      count: formData.get('isFlash') ? 1 : 100,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return redirect('/qualis/climb')
}

export default function Climb() {
  const { climb, top, nextScore } = useLoaderData()
  const navigate = useNavigate()
  const submit = useSubmit()
  const handleTop = () => submit({ isTop: 'true' }, { method: 'post' })
  const handleFlash = () => submit({ isFlash: 'true' }, { method: 'post' })
  const handleClear = () => submit({ clear: 'true' }, { method: 'post' })

  const activeClass = '!border-white'

  return (
    <div className="flex flex-1 flex-col items-center justify-around gap-10">
      <div className="climb-number">{climb.name}</div>
      <div className={`text-2xl ${top ? 'opacity-20' : ''}`}>
        {nextScore.toFixed(0)} points
      </div>
      <div className="flex flex-1 flex-col justify-around py-10 text-4xl">
        <button
          className={`button border-8 border-transparent bg-black ${
            top && !top.is_flash ? activeClass : ''
          }`}
          onClick={handleTop}
        >
          Top
        </button>
        <button
          className={`button border-8 border-transparent ${
            top?.is_flash ? activeClass : ''
          }`}
          onClick={handleFlash}
        >
          Flash
        </button>
        <button
          className="button bg-white text-black"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button className="button bg-white text-black" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  )
}
