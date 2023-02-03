import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ascending } from 'd3-array'
import { QRCodeSVG } from 'qrcode.react'
import { type Database } from '~/database.types'
import { serverClient } from '~/supabase'

type LoaderData = {
  climbs: Database['qdb_2022']['Tables']['climbs']['Row'][]
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
    <>
      {climbs
        .sort((a, b) => ascending(parseInt(a.name, 10), parseInt(b.name, 10)))
        .map((climb, i) => (
          <>
            <div
              key={climb.id}
              className="inline-flex w-1/2 flex-col items-center justify-center gap-10 border border-black bg-white p-10 text-black"
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
            {(i + 1) % 4 === 0 ? <div className="break-after-page" /> : null}
          </>
        ))}
    </>
  )
}