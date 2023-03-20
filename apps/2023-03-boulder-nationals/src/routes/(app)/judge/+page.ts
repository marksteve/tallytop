import type { PageLoad } from './$types'
import { rounds } from '$lib/labels'
import * as R from 'ramda'

export const load = (async () => {
  return {
    title: 'JUDGE',
    rounds: R.toPairs(rounds)
  }
}) satisfies PageLoad
