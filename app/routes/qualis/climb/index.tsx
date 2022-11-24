import { getSync as getImageData } from '@andreekeberg/imagedata'
import {
  json,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  type ActionFunction,
  type LoaderFunction,
} from '@remix-run/node'
import { Form, useLoaderData, useSubmit } from '@remix-run/react'
import QR from 'jsqr'
import { requireSignIn } from '~/loaders'

export const loader: LoaderFunction = async ({ request }) => {
  const shouldRedirect = await requireSignIn(request)
  if (shouldRedirect) {
    return shouldRedirect
  }

  return json({
    score: 100,
  })
}

export const action: ActionFunction = async ({ request }) => {
  const redirectParams = await requireSignIn(request)
  if (redirectParams) {
    return redirectParams
  }

  const uploadHandler = unstable_createMemoryUploadHandler()
  const formData = await unstable_parseMultipartFormData(request, uploadHandler)
  const blob = formData.get('capture')
  const imageData = getImageData(Buffer.from(await blob.arrayBuffer()))
  const results = await QR(imageData.data, imageData.width, imageData.height)
  if (!results) {
    throw new Error('Invalid code')
  }
  const { data: id } = results
  return redirect(`/qualis/climb/${id}`)
}

export default function ClimbIndex() {
  const { score } = useLoaderData()
  const submit = useSubmit()

  const handleCapture = (e) => submit(e.currentTarget)

  return (
    <div className="flex flex-1 flex-col items-center justify-around">
      <Form
        method="post"
        encType="multipart/form-data"
        onChange={handleCapture}
        replace
      >
        <label>
          <div className="button cursor-pointer text-4xl">CLIMB!</div>
          <input
            type="file"
            name="capture"
            accept="image/*;capture=camera"
            className="hidden"
          />
        </label>
      </Form>
      <div className="flex flex-col gap-5">
        <div className="text-2xl text-red">Your Points</div>
        <div className="text-8xl">{score}</div>
      </div>
    </div>
  )
}
