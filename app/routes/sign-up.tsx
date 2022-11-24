import { json, type ActionFunction } from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
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
