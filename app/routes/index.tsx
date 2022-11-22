import { json, type LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response()
  const supabase = serverClient(request, response)
  const {
    data: { rounds: currentRound },
    error,
  } = await supabase
    .from('comps')
    .select('rounds ( name )')
    .eq('id', process.env.COMP_ID)
    .single()
  if (error) {
    throw error
  }
  return json({ currentRound })
}

export default function Index() {
  const { currentRound } = useLoaderData()
  const linkClassName =
    'flex flex-1 items-center justify-center hover:opacity-50'
  return (
    <div className="flex flex-1 flex-col items-center text-[8vw]">
      {currentRound.name === 'Qualifiers' ? (
        <>
          <Link className={linkClassName} to="/qualis/climb">
            CLIMB!
          </Link>
        </>
      ) : null}
    </div>
  )
}
