import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async () => {
  return { menu: [], path: ['judge'] }
}
