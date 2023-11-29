import { AUTH } from '$env/static/private'
import { redirect, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, cookies }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData.entries())
  if (data.auth.toString() !== AUTH) {
    throw redirect(302, '/login')
  }
  cookies.set('auth', data.auth.toString(), { path: '/', httpOnly: true })
  throw redirect(302, '/admin')
}
