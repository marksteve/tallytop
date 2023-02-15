import type { Actions } from './$types'

export const actions = {
  flash: async (event) => {
    const formData = await event.request.formData()
    console.log('flash', event.params.team, formData.get('problem'))
  },
  top: async (event) => {
    const formData = await event.request.formData()
    console.log('top', event.params.team, formData.get('problem'))
  }
} satisfies Actions
