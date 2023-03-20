import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
  return {
    title: 'JUDGE',
    params,
    problems: []
  }
}) satisfies PageLoad
