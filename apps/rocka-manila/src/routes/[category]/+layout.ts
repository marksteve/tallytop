import { error } from '@sveltejs/kit'

const categories = {
  novice_men: `Novice Men's`,
  novice_women: `Novice Women's`,
  inter_men: `Inter Men's`,
  inter_women: `Inter Women's`,
}

export function load({ params }) {
  const category = categories[params.category as keyof typeof categories]
  if (!category) {
    throw error(404, 'Not found')
  }
  return {
    category,
  }
}
