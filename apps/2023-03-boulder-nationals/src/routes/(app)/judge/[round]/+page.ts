import { categories } from '$lib/labels'
import * as R from 'ramda'
import type { PageLoad } from './$types'

export const load = (async ({ params }) => {
  return {
    title: 'JUDGE',
    params,
    categories: R.toPairs(categories)
  }
}) satisfies PageLoad
