import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = serverClient(request)
  const { data: divisions, error } = await supabase
    .from('divisions')
    .select()
    .eq('comp_id', process.env.COMP_ID)
  if (error) {
    throw error
  }
  return json({ divisions })
}

export const action: ActionFunction = async ({ request }) => {
  const { name, email, password, divisionId } = Object.fromEntries(
    await request.formData()
  )
  const response = new Response()
  const supabase = serverClient(request, response)

  const {
    data: { user },
    error: signUpError,
  } = await supabase.auth.signUp({
    email: String(email),
    password: String(password),
    options: {
      data: {
        name: String(name),
      },
    },
  })
  if (signUpError) {
    return json({ error: signUpError.message })
  }

  const { count } = await supabase
    .from('competitors')
    .select('id', { count: 'exact' })
    .maybeSingle()
  const { error: competitorInsertError } = await supabase
    .from('competitors')
    .insert({
      id: String(user?.id),
      division_id: String(divisionId),
      round_id: process.env.QUALIS_ID,
      name: String(name),
      number: String((count ?? 0) + 1).padStart(3, '0'),
    })
  if (competitorInsertError) {
    return json({ error: competitorInsertError.message })
  }

  return redirect('/', { headers: response.headers })
}

export default function SignUp() {
  const { divisions } = useLoaderData()
  const actionData = useActionData()

  const [placeholderName, setPlaceholderName] = useState('Ate Girl')
  const handleChangeDivision = (e) => {
    const division = divisions.filter((d) => d.id === e.target.value).pop()
    if (division.name.startsWith('Men')) {
      setPlaceholderName('Kuya Boy')
    } else {
      setPlaceholderName('Ate Girl')
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 p-10">
      {actionData?.error ? (
        <div className="error">{actionData.error}</div>
      ) : null}
      <Form
        method="post"
        className="flex w-full max-w-screen-sm flex-col justify-center gap-5"
      >
        Division
        <select name="divisionId" onChange={handleChangeDivision}>
          {divisions.map((division) => (
            <option key={division.id} value={division.id}>
              {division.name}
            </option>
          ))}
        </select>
        Name
        <input
          className="font-input"
          name="name"
          type="text"
          placeholder={placeholderName}
          required
        />
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
          Sign Up
        </button>
      </Form>
      <Link to="/sign-in" className="text-center text-sm underline">
        Already have an account?
      </Link>
    </div>
  )
}
