import { Disclosure } from '@headlessui/react'
import { json, redirect, type ActionFunction } from '@remix-run/node'
import { Form, Link, useFetcher } from '@remix-run/react'
import { serverClient } from '~/supabase'

export const action: ActionFunction = async ({ request }) => {
  const redirectTo = new URL(request.url).searchParams.get('redirectTo')
  const { email, password } = Object.fromEntries(await request.formData())
  const response = new Response()
  const supabase = serverClient(request, response)
  const {
    data: { session },
    error,
  } = await supabase.auth.signInWithPassword({
    email: String(email),
    password: String(password),
  })

  if (error || !session) {
    // TODO: Do something
    throw new Error('Invalid credentials')
  }

  return redirect(redirectTo ?? '/', { headers: response.headers })
}

export default function SignIn() {
  const forgotPassword = useFetcher()
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-5 p-10">
      <Disclosure>
        {({ open }) => (
          <>
            {open ? null : (
              <Form
                method="post"
                className="flex flex-col items-center justify-center gap-5"
              >
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
                  Sign In
                </button>
                <Link to="/sign-up" className="text-center text-sm underline">
                  No account yet? Sign up!
                </Link>
              </Form>
            )}
            <Disclosure.Panel className="py-5">
              <forgotPassword.Form
                method="post"
                action="/forgot-password"
                className="flex flex-col items-center justify-center gap-5"
              >
                <input
                  className="font-input"
                  name="email"
                  type="text"
                  placeholder="Email"
                  required
                />
                <button
                  type="submit"
                  className="button"
                  disabled={forgotPassword.state !== 'idle'}
                >
                  Send reset link
                </button>
                {forgotPassword.type === 'done'
                  ? 'Check your email. Maybe look at your spam folder too!'
                  : null}
              </forgotPassword.Form>
            </Disclosure.Panel>
            <Disclosure.Button className="text-sm underline">
              {open ? 'Back to sign in' : 'Forgot password?'}
            </Disclosure.Button>
          </>
        )}
      </Disclosure>
    </div>
  )
}
