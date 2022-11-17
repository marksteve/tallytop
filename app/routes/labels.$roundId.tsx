import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { QRCodeSVG } from 'qrcode.react'
import { type Database } from '~/database.types'
import { serverClient } from '~/supabase'

type LoaderData = {
  climbs: Database['public']['Tables']['climbs']['Row'][]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { roundId } = params
  const response = new Response()
  const supabase = serverClient(request, response)
  const { data: climbs, error } = await supabase
    .from('climbs')
    .select()
    .eq('round_id', roundId)
  if (error || !climbs) {
    throw error
  }
  return json<LoaderData>({ climbs })
}

export default function Labels() {
  const { climbs } = useLoaderData<LoaderData>()
  return (
    <div className="flex flex-1 flex-wrap gap-1 p-10">
      {climbs.map((climb) => (
        <div key={climb.id} className="flex flex-col gap-5 border p-10">
          <div className="flex items-center gap-2">
            <div
              className={`h-5 w-5 rounded-full`}
              style={{ backgroundColor: climb.color ?? 'transparent' }}
            />
            {climb.name}
          </div>
          <QRCodeSVG value={climb.id} />
        </div>
      ))}
    </div>
  )
}
