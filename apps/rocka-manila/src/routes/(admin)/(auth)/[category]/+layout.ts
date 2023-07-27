import { error } from '@sveltejs/kit'
import { categories } from '$lib/constants'

export function load({ params, parent }) {
  const category = categories[params.category as keyof typeof categories]
  if (!category) {
    throw error(404, 'Not found')
  }
  return {
    category,
    ...parent(),
  }
}
