import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
import { browserClient, getClientEnv, serverClient } from '~/supabase'

export const action: ActionFunction = async ({ request }) => {
  const { password } = Object.fromEntries(await request.formData())
  const supabase = serverClient(request)
  const { error } = await supabase.auth.updateUser({
    password: String(password),
  })

  if (error) {
    // TODO: Do something
    throw new Error('Invalid password')
  }

  return redirect('/')
}

export const loader: LoaderFunction = async () => {
  return json({ clientEnv: getClientEnv(process.env) })
}

export default function UpdatePassword() {
  const { clientEnv } = useLoaderData()
  const supabase = browserClient(...clientEnv)

  useEffect(() => {
    supabase.auth.onAuthStateChange(() => {})
  })

  return (
    <div className="flex flex-1 flex-col items-center p-10">
      <Form
        method="post"
        className="flex w-full max-w-screen-sm flex-col justify-center gap-5"
      >
        New Password
        <input
          className="text-input"
          name="password"
          type="password"
          placeholder="cutest@321?!"
          required
        />
        <button type="submit" className="button">
          Update password
        </button>
      </Form>
    </div>
  )
}
