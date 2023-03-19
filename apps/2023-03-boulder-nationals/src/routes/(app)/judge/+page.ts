import type { PageLoad } from './$types'

export const load = (async () => {
  return {
    title: 'Judge',
    rounds: [
      ['qualis', 'Qualis'],
      ['finals', 'Finals']
    ]
  }
}) satisfies PageLoad
