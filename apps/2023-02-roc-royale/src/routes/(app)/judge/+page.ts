import type { PageLoad } from './$types'

export const load = (async () => {
  return {
    title: ['Judge', 'rotate-3'],
    rounds: [
      ['qualis', 'Qualis'],
      ['finals', 'Finals']
    ]
  }
}) satisfies PageLoad
