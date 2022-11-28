import { json, type LoaderFunction } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker'
import { useRef, useState } from 'react'
import { loadUser, requireSignIn } from '~/loaders'
import { serverClient } from '~/supabase'

export const loader: LoaderFunction = async ({ request }) => {
  const shouldRedirect = await requireSignIn(request)
  if (shouldRedirect) {
    return shouldRedirect
  }

  const supabase = serverClient(request)
  const user = await loadUser(supabase)

  const { data: tops } = await supabase
    .from('qualis_tops')
    .select('score, is_flash')
    .eq('competitor_id', user.id)

  const score = tops?.reduce(
    (total, { score, is_flash }) =>
      total +
      score * (is_flash ? parseFloat(process.env.QUALIS_FLASH_MULTIPLIER) : 1),
    0
  )

  return json({ tops, score })
}

const createWorker = createWorkerFactory(() => import('~/worker'))

export default function ClimbIndex() {
  const { tops, score } = useLoaderData()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const worker = useWorker(createWorker)

  const handleCapture = async (e) => {
    setError(null)
    setIsParsing(true)
    const reader = new FileReader()
    reader.addEventListener('loadend', () => {
      const img = new Image()
      const canvas = canvasRef.current!
      img.addEventListener('load', async () => {
        canvas.width = img.width
        canvas.height = img.height
        const context = canvas.getContext('2d')
        context?.drawImage(img, 0, 0)
        const imgData = context?.getImageData(0, 0, img.width, img.height)!
        const results = await worker.parseQR(imgData)
        if (!results) {
          setError('Invalid code')
          setIsParsing(false)
          return
        }
        const { data: id } = results
        navigate(`/qualis/climb/${id}`)
      })
      img.addEventListener('error', () => {
        setError('Invalid image')
        setIsParsing(false)
      })
      img.src = reader.result as string
    })
    reader.readAsDataURL(await worker.reduceBlob(e.target.files[0]))
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-around">
      <label className="flex flex-col items-center gap-5">
        <div className="button cursor-pointer text-4xl">
          {isParsing ? 'WAIT!' : 'CLIMB!'}
        </div>
        {error ? <div className="error">{error}</div> : null}
        <input
          type="file"
          name="capture"
          accept="image/*;capture=camera"
          className="hidden"
          onChange={handleCapture}
          disabled={isParsing}
        />
        <canvas className="hidden" ref={canvasRef} />
      </label>
      <div className="flex flex-col items-center gap-5">
        <div className="text-2xl text-red">Your Points</div>
        <div className="text-6xl">{score}</div>
        <div>{tops.length} tops</div>
      </div>
    </div>
  )
}
