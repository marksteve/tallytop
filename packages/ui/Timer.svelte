<script lang="ts" context="module">
  const MAX_DURATION = 5_940_000 // 99 mins

  export const parseDuration = (text: string) => {
    let timeComponents = (text ?? '').split(':')
    const components = ['seconds', 'minutes']
    let nextDuration = {}
    components.forEach((unit) => {
      if (timeComponents.length) {
        nextDuration[unit] = parseFloat(timeComponents.pop()!)
      }
    })
    return Math.min(MAX_DURATION, toMilliseconds(nextDuration))
  }

  export const formatDuration = (timeOrMs: TimeComponents | number) => {
    const time = typeof timeOrMs === 'number' ? parseMs(timeOrMs) : timeOrMs
    return [
      time.days * 24 + time.hours > 0
        ? String(Math.trunc(time.days * 24 + time.hours)).padStart(2, '0')
        : null,
      String(Math.trunc(time.minutes)).padStart(2, '0'),
      String(Math.trunc(time.seconds + time.milliseconds / 1000)).padStart(2, '0')
    ]
      .filter((p) => p !== null)
      .join(':')
  }
</script>

<script lang="ts">
  import toMilliseconds from '@sindresorhus/to-milliseconds'
  import supabase from '@tallytop/supabase'
  import { Howl } from 'howler'
  import { nanoid } from 'nanoid'
  import parseMs, { type TimeComponents } from 'parse-ms'
  import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise'
  import Play from 'phosphor-svelte/lib/Play'
  import Stop from 'phosphor-svelte/lib/Stop'
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import Button from './Button.svelte'

  type Status = 'started' | 'running' | 'stopped'
  type Event = 'start' | 'stop' | 'reset'

  let endTime: number
  let elapsed = 0
  let status: Status = 'stopped'

  export let duration = 5 * 60 * 1000
  let time = parseMs(duration)

  $: {
    time = parseMs(duration)
    elapsed = 0
  }

  const sound = {
    beep: new Howl({ src: '/sounds/beep.mp3' }),
    end: new Howl({ src: '/sounds/end.mp3' }),
    airhorn: new Howl({ src: '/sounds/airhorn.mp3' })
  }
  export let beeps = [60, 5, 4, 3, 2, 1, 0]
  let playedBeeps: number[] = []

  const dispatch = createEventDispatcher()

  const handleDurationChange = (e: FocusEvent) => {
    const text = (e.target as HTMLElement).textContent
    duration = parseDuration(text)
    dispatch('changeduration', { duration })
  }

  export const start = (endTimeInit?: number) => {
    endTime = endTimeInit ? endTimeInit : Date.now() + duration - elapsed
    status = 'started'
    if (!viewMode) {
      channel.send({ type: 'broadcast', event: 'start', payload: { endTimeInit: endTime } })
    }
  }

  export const stop = () => {
    const remaining = endTime - Date.now()
    elapsed = duration - remaining
    status = 'stopped'
    if (!viewMode) {
      channel.send({ type: 'broadcast', event: 'stop' })
    }
  }

  export const reset = () => {
    time = parseMs(duration)
    elapsed = 0
    status = 'stopped'
    playedBeeps = []
    if (!viewMode) {
      channel.send({ type: 'broadcast', event: 'reset' })
    }
  }

  const tick = () => {
    if (status === 'running') {
      let remaining = endTime - Date.now() + 1000
      time = parseMs(remaining)

      const seconds = Math.trunc(remaining / 1000)

      if (seconds < 0) {
        remaining = 0
      }
      if (seconds === 0) {
        stop()
        sound.airhorn.play()
        dispatch('end')
      }

      if (
        !playedBeeps.includes(seconds) &&
        (seconds === Math.trunc(duration / 1000) || beeps.includes(seconds))
      ) {
        sound.beep.play()
        playedBeeps = [...playedBeeps, seconds]
      }

      if (!viewMode) {
        trackTime()
      }

      requestAnimationFrame(tick)
    }
  }

  $: if (status === 'started') {
    status = 'running'
    tick()
  }

  const ID_LENGTH = 6

  export let browser = true
  export let viewMode = false
  export let id: string = browser
    ? window.localStorage.getItem('tallytop-timer-id') ?? nanoid(ID_LENGTH)
    : nanoid(ID_LENGTH)
  if (browser && !viewMode) {
    window.localStorage.setItem('tallytop-timer-id', id)
  }

  const channel = supabase.channel(
    `tallytop:${id}`,
    viewMode
      ? undefined
      : {
          config: { presence: { key: id } }
        }
  )

  onMount(() => {
    if (!browser) {
      return
    }
    if (viewMode) {
      channel.on('broadcast', { event: '*' }, ({ event, payload }) => {
        switch (event as Event) {
          case 'start':
            start(payload.endTimeInit)
            break
          case 'stop':
            stop()
            break
          case 'reset':
            reset()
            break
        }
      })
      channel.on('presence', { event: 'sync' }, () => {
        const prescence = channel.presenceState()?.[id]
        if (!prescence) {
          return
        }
        time = prescence[0] as unknown as TimeComponents
      })
    }
    channel.subscribe()
  })

  onDestroy(() => {
    if (!browser) {
      return
    }
    Promise.all([channel.unsubscribe(), channel.untrack()])
  })

  let broadcastLimit = 1 // rps
  let lastBroadcast: number = 0

  const trackTime = () => {
    if (Date.now() - lastBroadcast > broadcastLimit * 1000) {
      channel.track(time)
      lastBroadcast = Date.now()
    }
  }
</script>

<div
  class={`border-2 border-transparent font-mono text-[30vw] leading-none outline-none ${
    status !== 'running' ? 'rounded border-stone-200 px-10' : ''
  }`}
  contenteditable={status !== 'running'}
  on:blur={handleDurationChange}
>
  {formatDuration(time)}
</div>

{#if !viewMode}
  <div class="flex gap-10 text-4xl">
    {#if status === 'stopped'}
      <Button class="bg-emerald-200 px-10 py-5 hover:bg-emerald-300" on:click={() => start()}>
        <Play />
      </Button>
    {:else}
      <Button class="bg-orange-200 px-10 py-5 hover:bg-orange-300" on:click={() => stop()}>
        <Stop />
      </Button>
    {/if}
    <Button class="px-10 py-5" on:click={() => reset()}><ArrowCounterClockwise /></Button>
  </div>
{/if}
