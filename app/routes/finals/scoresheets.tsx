import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ascending } from 'd3-array'
import { useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = serverClient(request)

  const { data: divisions } = await supabase
    .from('divisions')
    .select()
    .eq('comp_id', process.env.COMP_ID)
  const { data: qualifiers } = await supabase.from('qualifiers').select()

  const { data: tops } = await supabase.from('qualis_tops_with_climbs').select()

  return json({ divisions, qualifiers, tops })
}

export default function Scoresheets() {
  const { divisions, qualifiers, tops } = useLoaderData()
  const [shouldShowLinks, showLinks] = useState(false)

  useEffect(() => {
    // Required to force CSVLink to be client-only
    showLinks(true)
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-10 p-10">
      <h2 className="text-4xl">Scoresheets</h2>
      <div className="flex flex-col gap-5">
        {divisions
          .map((division) => [
            division,
            qualifiers
              .filter((c) => c.division_id === division.id)
              .map((c) => ({
                id: c.id,
                number: c.number,
                name: c.name,
                rank: c.rank,
              })),
          ])
          // .filter(([, divisionQualifiers]) => divisionQualifiers.length > 0)
          .map(([division, divisionQualifiers]) => (
            <div
              key={division.id}
              className="flex items-start justify-between rounded-3xl bg-white p-10"
            >
              <div className="flex flex-1 flex-col gap-5">
                <h3 className="text-2xl">{division.name}</h3>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-red">
                      <th className="w-0 pr-10">Number</th>
                      <th className="w-0 pr-10">Rank</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {divisionQualifiers.map((c) => (
                      <tr key={c.rank}>
                        <td>{c.number}</td>
                        <td>{c.rank}</td>
                        <td className="py-5">
                          {c.name}
                          <div className="flex items-center gap-2">
                            {tops
                              .filter((t) => t.competitor_id === c.id)
                              .sort((a, b) =>
                                ascending(
                                  parseFloat(a.climb_name),
                                  parseFloat(b.climb_name)
                                )
                              )
                              .map((top, i) => (
                                <div
                                  key={i}
                                  className={`${
                                    top.is_flash
                                      ? 'bg-yellow text-black'
                                      : 'bg-red text-white'
                                  } flex h-7 w-7 items-center justify-center rounded-full text-xs`}
                                  title={`${top.score} points`}
                                >
                                  {top.climb_name}
                                </div>
                              ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-5">
                {shouldShowLinks ? (
                  <CSVLink
                    className="button"
                    data={divisionQualifiers.map((c) => ({
                      number: c.number,
                      name: c.name,
                      rank: c.rank,
                    }))}
                    filename={`${division.name} Finals Scoresheet.csv`}
                  >
                    Download
                  </CSVLink>
                ) : null}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
