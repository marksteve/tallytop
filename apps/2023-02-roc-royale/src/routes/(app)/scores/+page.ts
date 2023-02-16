import type { PageLoad } from './$types'

export const load = (() => {
  return {
    title: ['Scores', '-rotate-2'],
    rounds: [
      ['qualis', 'Qualis'],
      ['finals', 'Finals']
    ]
  }
}) satisfies PageLoad
