import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
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

  return json({ divisions, qualifiers })
}

export default function Scoresheets() {
  const { divisions, qualifiers } = useLoaderData()
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
                        <td>{c.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-5">
                {shouldShowLinks ? (
                  <CSVLink
                    className="button"
                    data={divisionQualifiers}
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
