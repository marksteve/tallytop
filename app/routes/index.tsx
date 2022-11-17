import { Link } from '@remix-run/react'

export default function Index() {
  const linkClassName =
    'flex flex-1 items-center justify-center hover:opacity-50'
  return (
    <div className="flex flex-1 flex-col items-center text-[8vw]">
      <Link className={linkClassName} to="/climb">
        CLIMB!
      </Link>
      <img src="/images/snow-mountain.svg" alt="Divider" />
      <Link className={linkClassName} to="/qualifiers">
        QUALIFIERS
      </Link>
      <img src="/images/snow-mountain.svg" alt="Divider" />
      <Link className={linkClassName} to="/problems">
        PROBLEMS
      </Link>
      <img src="/images/snow-mountain.svg" alt="Divider" />
      <Link className={linkClassName} to="/final">
        FINALS
      </Link>
    </div>
  )
}
