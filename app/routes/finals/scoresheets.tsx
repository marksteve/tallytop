import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
import { serverClient } from '~/supabase'

const FINALS_CUTOFF = 6

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = serverClient(request)

  const { data: divisions } = await supabase
    .from('divisions')
    .select()
    .eq('comp_id', process.env.COMP_ID)
  const { data: scoresheets } = await supabase
    .from('qualis_scoresheets')
    .select()

  return json({ divisions, scoresheets })
}

export default function Scoresheets() {
  const { divisions, scoresheets } = useLoaderData()
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
            scoresheets
              .filter((c) => c.division_id === division.id)
              .slice(0, FINALS_CUTOFF)
              .map((c) => ({
                number: c.number,
                name: c.name,
                rank: c.rank,
              })),
          ])
          .filter(([, divisionScoresheets]) => divisionScoresheets.length > 0)
          .map(([division, divisionScoresheets]) => (
            <div key={division.id} className="flex justify-between">
              {division.name}
              {shouldShowLinks ? (
                <CSVLink
                  className="button"
                  data={divisionScoresheets}
                  filename={`${division.name} Finals Scoresheet.csv`}
                >
                  Download
                </CSVLink>
              ) : null}
            </div>
          ))}
      </div>
    </div>
  )
}
