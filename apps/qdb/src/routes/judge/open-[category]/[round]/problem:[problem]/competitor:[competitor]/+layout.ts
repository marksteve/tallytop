import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ parent }) => {
  const prev = await parent()
  const menu = [
    ...prev.menu,
    {
      label: 'competitor',
      path: prev.path,
    },
  ]
  return { menu }
}
