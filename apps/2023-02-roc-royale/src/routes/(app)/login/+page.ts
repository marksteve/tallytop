import type { PageLoad } from './$types'

export const load = (async () => {
  return {
    title: ['Login', 'rotate-3'],
  }
}) satisfies PageLoad
