import type { PageLoad } from './$types'

export const load = (async () => {
  return {
    title: 'Judge',
    rounds: [
      ['qualis', 'QUALIS'],
      ['finals', 'FINALS']
    ]
  }
}) satisfies PageLoad
