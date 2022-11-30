import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import { rollup, rollups } from 'd3-array'
import Error from '~/components/error'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request, params }) => {
  const supabase = serverClient(request)
  const { data: climb } = await supabase
    .from('climbs')
    .select()
    .eq('round_id', process.env.FINALS_ID)
    .eq('id', params['id'])
    .single()
  const { data: qualifiers } = await supabase
    .from('qualifiers')
    .select()
    .eq('division_id', climb.division_id)
    .order('rank', { ascending: false })
  const { data: attempts } = await supabase
    .from('attempts_finals')
    .select()
    .eq('climb_id', params['id'])
  return json({ climb, qualifiers, attempts })
}

export const action: ActionFunction = async ({ request, params }) => {
  const supabase = serverClient(request)
  const data = Object.fromEntries(await request.formData())
  const competitorAttempts = rollups(
    Object.entries(data).map(([key, value]) => {
      const [attempt, id] = key.split(':')
      return { attempt, id, value }
    }),
    ([za, ta]) => ({ za: za.value, ta: ta.value }),
    (d) => d.id
  ).map(([id, attempts]) => ({ ...attempts, id }))
  for (const competitorAttempt of competitorAttempts) {
    // TODO: Error handling
    await supabase.from('attempts_finals').upsert({
      climb_id: params['id'],
      competitor_id: competitorAttempt.id,
      zone_attempts: competitorAttempt.za,
      top_attempts: competitorAttempt.ta,
    })
  }
  return json({ message: 'Saved attempts!' })
}

export default function Boulder() {
  const { climb, qualifiers, attempts } = useLoaderData()
  const action = useActionData()
  const attemptsMap = rollup(
    attempts,
    (v) => v[0],
    (d) => d.competitor_id
  )
  return (
    <Form
      method="post"
      className="flex flex-1 flex-col items-center gap-10 p-10"
    >
      <h2 className="text-6xl">{climb.name}</h2>
      <div className="rounded-3xl bg-white p-10">
        <table>
          <thead>
            <tr className="text-red">
              <th className="text-left">Competitor</th>
              <th>ZA</th>
              <th>TA</th>
            </tr>
          </thead>
          <tbody>
            {qualifiers.map((competitor) => (
              <Competitor
                key={competitor.id}
                competitor={competitor}
                attempts={attemptsMap.get(competitor.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      {action?.message ? <Error>{action.message}</Error> : null}
      <div className="flex gap-5 text-4xl">
        <Link to="/finals/boulders" className="button bg-black">
          Back
        </Link>
        <button className="button">Save</button>
      </div>
    </Form>
  )
}

function Competitor({ competitor, attempts }) {
  return (
    <tr key={competitor.id}>
      <td className="text-2xl">{competitor.name}</td>
      <td className="px-5 text-center">
        <input
          type="number"
          name={`za:${competitor.id}`}
          className="w-20 text-center"
          defaultValue={attempts?.zone_attempts ?? 0}
        />
      </td>
      <td className="p-5 text-center">
        <input
          type="number"
          name={`ta:${competitor.id}`}
          className="w-20 text-center"
          defaultValue={attempts?.top_attempts ?? 0}
        />
      </td>
    </tr>
  )
}
