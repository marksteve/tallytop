import parseMs from 'parse-ms'
import { useCallback, useEffect, useRef, useState } from 'react'

const defaultBeeps = [
  2 * 60 * 60, // 2:00:00
  1 * 60 * 60, // 1:00:00
  60,          // 0:01:00
  5,           // 0:00:05
  4,           // 0:00:04
  3,           // 0:00:03
  2,           // 0:00:02
  1            // 0:00:01
]

const useTimer = (duration: number) => {
  const [state, setState] = useState({
    duration,
    time: parseMs(duration),
  })
  const sound = useRef<any>()
  const beeps = useRef(defaultBeeps)
  const endDate = useRef(new Date())
  const elapsed = useRef(0)
  const isRunning = useRef(false)

  const start = () => {
    endDate.current = new Date(Date.now() + duration - elapsed.current)
    isRunning.current = true
    if (elapsed.current === 0) {
      sound.current.play('beep')
    }
  }

  const stop = () => {
    const remaining = endDate.current.getTime() - Date.now()
    elapsed.current = duration - remaining
    isRunning.current = false
  }

  const reset = useCallback(() => {
    setState((state) => ({
      ...state,
      time: parseMs(state.duration),
    }))
    elapsed.current = 0
    isRunning.current = false
    beeps.current = defaultBeeps
  }, [])

  const tick = useCallback(() => {
    if (isRunning.current) {
      let remaining = endDate.current.getTime() - Date.now()
      if (remaining < 0) {
        remaining = 0
      }
      const time = parseMs(remaining)
      setState((state) => ({
        ...state,
        time,
      }))
      const second = Math.floor(remaining / 1000) + 1
      if (beeps.current.includes(second)) {
        beeps.current = beeps.current.filter((v) => v !== second)
        sound.current.play('beep')
      }
      if (remaining === 0) {
        stop()
        sound.current.play('end')
      }
    }
    requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    setState((state) => ({ ...state, duration }))
    reset()
  }, [reset, duration])

  useEffect(() => {
    requestAnimationFrame(tick)
  }, [tick])

  useEffect(() => {
    import('@pixi/sound').then(({ sound: pixiSound }) => {
      if (sound.current) {
        // This runs twice for some reason!
        return
      }
      sound.current = pixiSound
      sound.current.add('beep', '/sounds/beep.mp3')
      sound.current.add('end', '/sounds/end.mp3')
    })
  }, [])

  return { ...state, isRunning: isRunning.current, start, stop, reset }
}

export default function Timer() {
  const [duration, setDuration] = useState(5 * 60 * 1000)
  const beep = useRef<any>()
  const { start, stop, reset, time } = useTimer(duration, beep)
  const { hours, minutes, seconds, milliseconds } = time

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10">
      <div className="font-mono text-[15vw] text-red">
        {hours ? `${String(hours).padStart(2, '0')}:` : null}
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        <span className="text-[7vw]">
          .{String(milliseconds).padStart(3, '0')}
        </span>
      </div>
      <div className="flex gap-10 text-4xl">
        <button className="button px-10 py-5" onClick={start}>
          Start
        </button>
        <button className="button bg-black px-10 py-5" onClick={stop}>
          Stop
        </button>
        <button className="button bg-black px-10 py-5" onClick={reset}>
          Reset
        </button>
      </div>
      <div className="flex gap-10 text-2xl">
        <button
          className="button bg-black"
          onClick={() => setDuration(3 * 60 * 60 * 1000)}
        >
          3 hrs
        </button>
        <button
          className="button bg-black"
          onClick={() => setDuration(5 * 60 * 1000)}
        >
          5 mins
        </button>
        <button
          className="button bg-black"
          onClick={() => setDuration(4 * 60 * 1000)}
        >
          4 mins
        </button>
        <button
          className="button bg-black"
          onClick={() => setDuration(2 * 60 * 1000)}
        >
          2 mins
        </button>
      </div>
    </div>
  )
}
