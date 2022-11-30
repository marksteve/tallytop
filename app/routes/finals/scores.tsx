import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = serverClient(request)
  const { data: divisions } = await supabase.from('divisions').select()
  const { data: finalists } = await supabase.from('finalists').select()
  return json({ divisions, finalists })
}

export default function Scores() {
  const { divisions, finalists } = useLoaderData()
  return (
    <div className="flex flex-1 flex-col gap-10 p-10">
      <h2 className="text-4xl">Finals Scores</h2>
      <div className="flex flex-col gap-5">
        {divisions
          .map((division) => [
            division,
            finalists.filter((c) => c.division_id === division.id),
          ])
          .filter(([, divisionFinalists]) => divisionFinalists.length > 0)
          .map(([division, divisionFinalists]) => (
            <div key={division.id} className="rounded-3xl bg-white p-10">
              <h3 className="text-2xl">{division.name}</h3>
              <table className="w-full">
                <thead className="text-center">
                  <tr>
                    <td colSpan={5}></td>
                    <td colSpan={2} className="text-xs">
                      Attempts
                    </td>
                  </tr>
                  <tr className="text-center text-red">
                    <th className="w-0 px-5">Number</th>
                    <th className="w-0 px-5">Rank</th>
                    <th className="text-left">Name</th>
                    <th className="w-0 px-5">Tops</th>
                    <th className="w-0 px-5">Zones</th>
                    <th className="w-0 px-5">Tops</th>
                    <th className="w-0 px-5">Zones</th>
                  </tr>
                </thead>
                <tbody>
                  {divisionFinalists.map((c, i) => (
                    <tr key={c.id} className="text-center">
                      <td>{c.number}</td>
                      <td>{i + 1}</td>
                      <td className="text-left">{c.name}</td>
                      <td>{c.tops}</td>
                      <td>{c.zones}</td>
                      <td>{c.top_attempts}</td>
                      <td>{c.zone_attempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>
    </div>
  )
}
