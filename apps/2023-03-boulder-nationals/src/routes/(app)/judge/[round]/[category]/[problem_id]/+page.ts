import type { PageLoad } from './$types'

export const load = (async (event) => {
  return {
    title: 'JUDGE',
    params: event.params,
  }
}) satisfies PageLoad
