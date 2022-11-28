import { redirect, type ActionFunction } from '@remix-run/node'
import { Form, Link } from '@remix-run/react'
import { serverClient } from '~/supabase'

export const action: ActionFunction = async ({ request }) => {
  const { name, email, password } = Object.fromEntries(await request.formData())
  const response = new Response()
  const supabase = serverClient(request, response)
  const { error } = await supabase.auth.signUp({
    email: String(email),
    password: String(password),
    options: { data: { name } },
  })
  if (error) {
    throw error
  }

  return redirect('/', { headers: response.headers })
}

export default function SignUp() {
  return (
    <Form
      method="post"
      className="flex h-full flex-1 flex-col items-center justify-center gap-5 p-10"
    >
      <input
        className="font-input"
        name="name"
        type="text"
        placeholder="Name"
        required
      />
      <input
        className="font-input"
        name="email"
        type="text"
        placeholder="Email"
        required
      />
      <input
        className="font-input"
        name="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit" className="button">
        Sign Up
      </button>
      <Link to="/sign-in" className="text-center text-sm underline">
        Already have an account?
      </Link>
    </Form>
  )
}
