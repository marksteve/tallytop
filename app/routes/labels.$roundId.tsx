import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ascending } from 'd3-array'
import { QRCodeSVG } from 'qrcode.react'
import { type Database } from '~/database.types'
import { serverClient } from '~/supabase'

type LoaderData = {
  climbs: Database['public']['Tables']['climbs']['Row'][]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { roundId } = params
  const supabase = serverClient(request)
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
    <div className="flex flex-1 flex-wrap justify-center gap-x-1 gap-y-20 p-10">
      {climbs
        .sort((a, b) => ascending(parseInt(a.name, 10), parseInt(b.name, 10)))
        .map((climb) => (
          <div
            key={climb.id}
            className="flex flex-col justify-center gap-10 border border-black bg-white px-10 py-8 text-black"
          >
            <div className="flex flex-col items-center gap-5">
              <div className="font-cursive leading-[0.5em]">
                <span
                  className="text-4xl text-yellow"
                  style={{
                    textShadow: '2px 2px 0 black',
                    WebkitTextStroke: '1px black',
                  }}
                >
                  Queso
                </span>
                <br />
                <span className="pl-7">de Boulder</span>
              </div>
              <div className="climb-number">{climb.name}</div>
            </div>
            <QRCodeSVG
              value={climb.id}
              imageSettings={{
                src: '/images/qdb-logo.svg',
                width: 32,
                height: 32,
                excavate: true,
              }}
              bgColor="transparent"
              fgColor="currentColor"
              size={192}
            />
          </div>
        ))}
    </div>
  )
}
