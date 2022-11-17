import { Link } from '@remix-run/react'

export default function Index() {
  const linkClassName =
    'flex flex-1 items-center justify-center hover:bg-white/50'
  return (
    <div className="flex flex-1 flex-col text-[8vw]">
      <Link className={linkClassName} to="/leaderboard">
        LEADERBOARD
      </Link>
      <Link className={linkClassName} to="/boulders">
        BOULDERS
      </Link>
      <Link className={linkClassName} to="/finals">
        FINALS
      </Link>
    </div>
  )
}
