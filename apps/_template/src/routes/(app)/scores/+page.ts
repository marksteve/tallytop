import type { PageLoad } from './$types'

export const load = (() => {
  return {
    rounds: [
      ['qualis', 'Qualis'],
      ['finals', 'Finals']
    ]
  }
}) satisfies PageLoad
