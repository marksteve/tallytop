import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ parent, params }) => {
  const prev = await parent()
  const menu = [
    ...prev.menu,
    {
      label: 'team',
      path: prev.path,
    },
  ]
  return { menu, path: [...prev.path, `team:${params.team}`] }
}
