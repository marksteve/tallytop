import { redirect } from '@sveltejs/kit'

export function load({ cookies }) {
  cookies.delete('token')
  throw redirect(301, '/login')
}
