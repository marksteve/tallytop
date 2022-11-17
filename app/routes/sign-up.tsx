import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import { loadSession } from '~/loaders'
import { serverClient } from '~/supabase'

export const action: ActionFunction = async ({ request }) => {
  const { email, password } = Object.fromEntries(await request.formData())
  const response = new Response()
  const supabase = serverClient(request, response)
  const { data, error } = await supabase.auth.signUp({
    email: String(email),
    password: String(password),
  })

  return json(
    { data, error },
    {
      headers: response.headers,
    }
  )
}

export const loader: LoaderFunction = async ({ request }) => {
  const response = new Response()
  const supabase = serverClient(request, response)
  const session = await loadSession(supabase)

  if (session) {
    return redirect('/')
  }

  return json({ session })
}

export default function SignUp() {
  return (
    <Form
      method="post"
      className="flex h-full flex-1 flex-col items-center justify-center gap-5"
    >
      <input name="email" type="text" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit" className="button">
        Sign Up
      </button>
      <Link to="/sign-in" className="text-sm underline">
        Already have an account? Sign in instead.
      </Link>
    </Form>
  )
}
