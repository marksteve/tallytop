import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = serverClient(request)

  const { data: divisions } = await supabase
    .from('divisions')
    .select()
    .eq('comp_id', process.env.COMP_ID)
  const { data: rankings } = await supabase.from('qualis_rankings').select()

  return json({ divisions, rankings })
}

export default function Scores() {
  const { divisions, rankings } = useLoaderData()
  const [selectedDivision, selectDivision] = useState(divisions[0].id)
  const handleSelectDivision = (e) => {
    selectDivision(e.target.value)
  }
  console.log(
    selectedDivision,
    rankings.filter((c) => c.division_id === selectedDivision)
  )
  return (
    <div className="flex flex-1 flex-col gap-5 p-10">
      <select value={selectedDivision} onChange={handleSelectDivision}>
        {divisions.map((division) => (
          <option key={division.id} value={division.id}>
            {division.name}
          </option>
        ))}
      </select>
      <table>
        <thead>
          <tr className="text-red text-left">
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {rankings
            .filter((c) => c.division_id === selectedDivision)
            .map((competitor) => (
              <tr key={competitor.id}>
                <td>{competitor.id}</td>
                <td>{competitor.score}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
