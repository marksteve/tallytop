import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ parent, params }) => {
  const prev = await parent()
  const label = {
    m: 'open mens',
    w: 'open womens',
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
