import { redirect } from '@sveltejs/kit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async (event) => {
  const { session } = await event.parent()
  if (!session) {
    throw redirect(303, '/login')
  }
}
