import { json, type LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData, useNavigate } from '@remix-run/react'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker'
import { QrCode } from 'lucide-react'
import { useEffect, useRef } from 'react'
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
  const worker = useWorker(createWorker)

  useEffect(() => {
    if (!worker || !canvasRef.current) {
      return
    }

    const canvas = canvasRef.current!
    const context = canvas.getContext('2d', { willReadFrequently: true })!
    const video = document.createElement('video')

    const tick = async () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight
        canvas.width = video.videoWidth
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        )
        const results = await worker.parseQR(
          imageData.data,
          imageData.width,
          imageData.height,
          {
            inversionAttempts: 'dontInvert',
          }
        )
        if (results) {
          const { data: id } = results
          navigate(`/qualis/climb/${id}`)
          return
        }
      }
      requestAnimationFrame(tick)
    }

    navigator.mediaDevices
      .getUserMedia({
        video: { aspectRatio: 1, facingMode: { ideal: 'environment' } },
      })
      .then((stream) => {
        video.srcObject = stream
        video.setAttribute('playsinline', 'true')
        video.play()
        requestAnimationFrame(tick)
      })
  }, [worker, navigate, canvasRef])

  return (
    <div className="flex flex-1 flex-col items-center justify-around">
      <div className="flex flex-col items-center gap-5 p-10">
        <div className="flex flex-col items-center gap-5 p-10">
          <div className="relative flex aspect-square w-full items-center justify-center rounded-3xl border-8 border-white">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full rounded-2xl"
            />
            <QrCode className="text-white" size={128} />
          </div>
          SCAN BOULDER QR
        </div>
        <div className="text-2xl text-red">Your Points</div>
        <div className="text-6xl">{score}</div>
        <Link className="button" to="/qualis/climb/tops">
          {tops.length} tops
        </Link>
      </div>
    </div>
  )
}