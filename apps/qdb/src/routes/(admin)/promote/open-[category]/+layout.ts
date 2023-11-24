import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ parent, params }) => {
  const prev = await parent()
  const label = {
    m: `open men's`,
    w: `open women's`,
  }[params.category]
  const menu = [
    ...prev.menu,
    {
      label,
      path: prev.path,
    },
  ]
  return { menu, path: [...prev.path, `open-${params.category}`] }
}
