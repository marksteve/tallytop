import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ parent, params }) => {
  const prev = await parent()
  const menu = [
    ...prev.menu,
    {
      label: 'teams',
      path: prev.path,
    },
  ]
  return { menu, path: [...prev.path, 'teams'] }
}
