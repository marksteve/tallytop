import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { browserClient, getClientEnv, serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = serverClient(request)

  const { data: divisions } = await supabase
    .from('divisions')
    .select()
    .eq('comp_id', process.env.COMP_ID)
  const { data: climbs } = await supabase.from('qualis_climbs').select()
  const clientEnv = getClientEnv(process.env)

  return json({ divisions, climbs, clientEnv })
}

export default function Boulders() {
  const { divisions, climbs, clientEnv } = useLoaderData()
  const [selectedDivision, selectDivision] = useState(divisions[0].id)
  const [liveClimbs, setLiveClimbs] = useState(climbs)
  const handleSelectDivision = (e) => {
    selectDivision(e.target.value)
  }
  const supabase = browserClient(...clientEnv)
  supabase
    .channel('public:attempts')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'attempts' },
      async (payload) => {
        const { data: climbs } = await supabase.from('qualis_climbs').select()
        setLiveClimbs(climbs)
      }
    )
    .subscribe()
  return (
    <div className="flex flex-1 flex-col gap-5 p-10">
      <h2 className="text-4xl">Boulders</h2>
      <select value={selectedDivision} onChange={handleSelectDivision}>
        {divisions.map((division) => (
          <option key={division.id} value={division.id}>
            {division.name}
          </option>
        ))}
      </select>
      <table className='leading-loose'>
        <thead>
          <tr className="text-left text-red">
            <th>Boulder</th>
            <th>Tops</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {liveClimbs
            .filter((c) => c.division_id === selectedDivision)
            .map((climb) => (
              <tr key={climb.id}>
                <td>{climb.name}</td>
                <td>{climb.tops}</td>
                <td>{climb.score}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
