import type { Actions } from './$types'

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData()
    const cutoff = Number(formData.get('cutoff'))
    console.log({ cutoff })
    return { cutoff }
  }
} satisfies Actions
