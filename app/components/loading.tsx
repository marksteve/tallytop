export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-5 bg-white/90">
      <div className="animate-bounce">
        <img src="/images/favicon.svg" alt="Queso" className="-rotate-12" />
      </div>
      Please Wait&hellip;
    </div>
  )
}
