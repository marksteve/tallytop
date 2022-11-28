import { json, type LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData, useMatches } from '@remix-run/react'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = serverClient(request)
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
  const [
    {
      data: { user },
    },
  ] = useMatches()
  return (
    <div className="flex flex-1 flex-col items-center text-[8vw]">
      {currentRound.name === 'Qualifiers' ? (
        <>
          {user ? (
            <>
              <IndexLink to="/qualis/climb">CLIMB!</IndexLink>
              <Divider />
            </>
          ) : null}
          <IndexLink to="/qualis/scores">SCORES</IndexLink>
        </>
      ) : null}
    </div>
  )
}

const IndexLink = ({ children, to, ...params }) => (
  <Link
    className="flex flex-1 items-center justify-center hover:opacity-50"
    to={to}
    {...params}
  >
    {children}
  </Link>
)

const Divider = () => <img src="/images/snow-mountain.svg" alt="Divider" />
