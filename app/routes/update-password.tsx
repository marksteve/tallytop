import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
import { loadSession } from '~/loaders'
import { browserClient, serverClient } from '~/supabase'

export const action: ActionFunction = async ({ request }) => {
  const { password } = Object.fromEntries(await request.formData())
  const response = new Response()
  const supabase = serverClient(request, response)
  const { error } = await supabase.auth.updateUser({
    password: String(password),
  })

  if (error) {
    // TODO: Do something
    throw new Error('Invalid password')
  }

  return redirect('/')
}

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response()
  const supabase = serverClient(request, response)
  const session = await loadSession(supabase)
  return json({ env: process.env, session }, { headers: response.headers })
}

export default function UpdatePassword() {
  const { env } = useLoaderData()
  const supabase = browserClient(env)

  useEffect(() => {
    supabase.auth.onAuthStateChange(() => {})
  })

  return (
    <Form
      method="post"
      className="flex h-full flex-1 flex-col items-center justify-center gap-5"
    >
      <input name="password" type="password" placeholder="New Password" />
      <button type="submit" className="button">
        Update password
      </button>
    </Form>
  )
}
