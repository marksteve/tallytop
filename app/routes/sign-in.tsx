import { Disclosure } from '@headlessui/react'
import { json, redirect, type ActionFunction } from '@remix-run/node'
import { Form, Link, useActionData, useFetcher } from '@remix-run/react'
import { serverClient } from '~/supabase'

export const action: ActionFunction = async ({ request }) => {
  const redirectTo = new URL(request.url).searchParams.get('redirectTo')
  const { email, password } = Object.fromEntries(await request.formData())
  const response = new Response()
  const supabase = serverClient(request, response)
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email),
    password: String(password),
  })

  if (error) {
    return json({ error: error.message })
  }

  return redirect(redirectTo ?? '/', { headers: response.headers })
}

export default function SignIn() {
  const forgotPassword = useFetcher()
  const actionData = useActionData()
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 p-10">
      {actionData?.error ? (
        <div className="error">{actionData.error}</div>
      ) : null}
      <Disclosure>
        {({ open }) => (
          <>
            {open ? null : (
              <Form
                method="post"
                className="flex w-full max-w-screen-sm flex-col justify-center gap-5"
              >
                Email
                <input
                  className="font-input"
                  name="email"
                  type="text"
                  placeholder="boulderista@gmail.com"
                  required
                />
                Password
                <input
                  className="font-input"
                  name="password"
                  type="password"
                  placeholder="cute@123!"
                  required
                />
                <button type="submit" className="button">
                  Sign In
                </button>
              </Form>
            )}
            <Disclosure.Panel className="w-full max-w-screen-sm py-5">
              {forgotPassword.type === 'done' ? (
                <div className="text-input p-10 text-xs">
                  Check your email. Maybe look at your spam folder too!
                </div>
              ) : null}
              <forgotPassword.Form
                method="post"
                action="/forgot-password"
                className="flex flex-col justify-center gap-5"
              >
                Email
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
              </forgotPassword.Form>
            </Disclosure.Panel>
            <Link to="/sign-up" className="text-center text-sm underline">
              No account yet? Sign up!
            </Link>
            <Disclosure.Button className="text-sm underline">
              {open ? 'Back to sign in' : 'Forgot password?'}
            </Disclosure.Button>
          </>
        )}
      </Disclosure>
    </div>
  )
}
