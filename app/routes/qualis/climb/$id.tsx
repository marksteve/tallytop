import {
  type ActionFunction,
  json,
  type LoaderFunction,
  redirect,
} from '@remix-run/node'
import { useLoaderData, useSubmit } from '@remix-run/react'
import { loadUser, requireSignIn } from '~/loaders'
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
      attempts(*)
      `
    )
    .eq('id', params['id'])
    .single()
  if (error) {
    throw error
  }

  return json({ climb })
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
    return json({ ok: true })
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
  const { climb } = useLoaderData()
  const submit = useSubmit()
  const handleTop = () => submit({ isTop: 'true' }, { method: 'post' })
  const handleFlash = () => submit({ isFlash: 'true' }, { method: 'post' })
  const handleClear = () => submit({ clear: 'true' }, { method: 'post' })
  const isTop = climb.attempts[0]?.is_top && climb.attempts[0].count > 1
  const isFlash = climb.attempts[0]?.is_top && climb.attempts[0].count === 1
  const activeClass = 'border-4 border-white'
  return (
    <div className="flex flex-1 flex-col items-center justify-around gap-10">
      <div className="climb-number">{climb.name}</div>
      <div className={`text-2xl ${isTop || isFlash ? 'opacity-20' : ''}`}>
        100 points
      </div>
      <div className="flex flex-1 flex-col justify-around text-4xl">
        <button
          className={`button bg-black ${isTop ? activeClass : ''}`}
          onClick={handleTop}
        >
          Top
        </button>
        <button
          className={`button ${isFlash ? activeClass : ''}`}
          onClick={handleFlash}
        >
          Flash
        </button>
        <button className="button bg-white text-black" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  )
}
