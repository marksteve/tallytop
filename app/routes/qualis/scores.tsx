import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { browserClient, getClientEnv, serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = serverClient(request)

  const { data: divisions } = await supabase
    .from('divisions')
    .select()
    .eq('comp_id', process.env.COMP_ID)
  const { data: rankings } = await supabase.from('qualis_rankings').select()
  const clientEnv = getClientEnv(process.env)

  return json({ divisions, rankings, clientEnv })
}

export default function Scores() {
  const { divisions, rankings, clientEnv } = useLoaderData()
  const [selectedDivision, selectDivision] = useState(divisions[0].id)
  const [liveRankings, setLiveRankings] = useState(rankings)
  const handleSelectDivision = (e) => {
    selectDivision(e.target.value)
  }
  useEffect(() => {
    const supabase = browserClient(...clientEnv)
    const channel = supabase
      .channel('public:attempts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attempts' },
        async () => {
          const { data: rankings } = await supabase
            .from('qualis_rankings')
            .select()
          setLiveRankings(rankings)
        }
      )
      .subscribe()
    return () => channel.unsubscribe()
  })
  return (
    <div className="flex flex-1 flex-col gap-5 p-10">
      <h2 className="text-4xl">Scores</h2>
      <select value={selectedDivision} onChange={handleSelectDivision}>
        {divisions.map((division) => (
          <option key={division.id} value={division.id}>
            {division.name}
          </option>
        ))}
      </select>
      <table className="leading-loose">
        <thead>
          <tr className="text-left text-red">
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {liveRankings
            .filter((c) => c.division_id === selectedDivision)
            .map((competitor) => (
              <tr key={competitor.id}>
                <td>{competitor.name}</td>
                <td>{competitor.score}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
