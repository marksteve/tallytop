import { json, type ActionFunction } from '@remix-run/node'
import { serverClient } from '~/supabase'

export const action: ActionFunction = async ({ request }) => {
  const { email } = Object.fromEntries(await request.formData())
  const supabase = serverClient(request)
  const { error } = await supabase.auth.resetPasswordForEmail(
    String(email),
    {
      redirectTo: `${process.env.APP_HOST}/update-password`,
    }
  )
  if (error) {
    return json({ error })
  }
  return json({ ok: true })
}
