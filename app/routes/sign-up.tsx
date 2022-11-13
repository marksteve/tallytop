import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from '@remix-run/node'
import { Form } from '@remix-run/react'
import { loadSession } from '~/loaders'
import { serverClient } from '~/supabase'

export const action: ActionFunction = async ({ request }) => {
  const { email, password } = Object.fromEntries(await request.formData())
  const response = new Response()
  const supabaseClient = serverClient(request, response)
  const { data, error } = await supabaseClient.auth.signUp({
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
  const supabaseClient = serverClient(request, response)
  const session = await loadSession(supabaseClient)

  if (session) {
    return redirect('/')
  }
  return json({ session }, { headers: response.headers })
}

export default function SignUp() {
  return (
    <Form
      method="post"
      className="flex-1 flex flex-col gap-5 justify-center items-center"
    >
      <input name="email" type="text" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit" className="button bg-pink-500">
        Sign Up
      </button>
    </Form>
  )
}
