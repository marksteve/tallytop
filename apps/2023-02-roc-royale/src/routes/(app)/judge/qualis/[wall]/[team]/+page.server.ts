import type { Actions } from './$types'

export const actions = {
  flash: async (event) => {
    const formData = await event.request.formData()
  },
  top: async (event) => {
    const formData = await event.request.formData()
  }
} satisfies Actions
