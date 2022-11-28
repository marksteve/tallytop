export default function Error({ children }) {
  return children ? (
    <div className="rounded-3xl bg-yellow p-5 text-xs text-red">{children}</div>
  ) : null
}
