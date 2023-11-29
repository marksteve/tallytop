import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.credentials = {
    userID: 'public',
    auth: 'public',
  }

  if (event.url.pathname.startsWith('/admin')) {
    const auth = event.cookies.get('auth')
    if (auth) {
      event.locals.credentials = { userID: 'admin', auth }
    } else {
      throw redirect(302, '/login')
    }
  }

  return await resolve(event)
}
