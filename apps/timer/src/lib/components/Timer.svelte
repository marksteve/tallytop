<script lang="ts">
  import { browser } from '$app/environment'
  import toMilliseconds from '@sindresorhus/to-milliseconds'
  import supabase from '@tallytop/supabase'
  import { Button } from '@tallytop/ui'
  import { Howl } from 'howler'
  import { nanoid } from 'nanoid'
  import parseMs, { type TimeComponents } from 'parse-ms'
  import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise'
  import Eye from 'phosphor-svelte/lib/Eye'
  import Play from 'phosphor-svelte/lib/Play'
  import Stop from 'phosphor-svelte/lib/Stop'
  import { onDestroy, onMount } from 'svelte'

  const ID_LENGTH = 6

  type Status = 'started' | 'running' | 'stopped'
  type Event = 'start' | 'stop' | 'reset'

  let endTime: number
  let elapsed = 0
  let status: Status = 'stopped'

  export let duration = 5 * 60 * 1000
  let time = parseMs(duration)

  const sound = {
    beep: new Howl({ src: '/sounds/beep.mp3' }),
    end: new Howl({ src: '/sounds/end.mp3' })
  }
  export let beeps = [0, 60, 5, 4, 3, 2, 1]
  let playedBeeps: number[] = []

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

  function handleDurationChange(e: FocusEvent) {
    const text = (e.target as HTMLElement).textContent
    let timeComponents = (text ?? '').split(':')
    if (!timeComponents.length) {
      return
    }
    let seconds = timeComponents.pop()
    if (!timeComponents.length) {
      duration = toMilliseconds({ seconds: parseFloat(seconds!) })
      return
    }
    let minutes = timeComponents.pop()
    duration = toMilliseconds({ minutes: parseFloat(minutes!), seconds: parseFloat(seconds!) })
  }

  function start(endTimeInit?: number) {
    endTime = endTimeInit ? endTimeInit : Date.now() + duration - elapsed
    status = 'started'
    if (!viewMode) {
      channel.send({ type: 'broadcast', event: 'start', payload: { endTimeInit: endTime } })
    }
  }

  function stop() {
    const remaining = endTime - Date.now()
    elapsed = duration - remaining
    status = 'stopped'
    if (!viewMode) {
      channel.send({ type: 'broadcast', event: 'stop' })
    }
  }

  function reset() {
    time = parseMs(duration)
    elapsed = 0
    status = 'stopped'
    playedBeeps = []
    if (!viewMode) {
      channel.send({ type: 'broadcast', event: 'reset' })
    }
  }

  function tick() {
    if (status === 'running') {
      let remaining = endTime - Date.now()
      time = parseMs(remaining)

      if (remaining < 0) {
        remaining = 0
      }
      if (remaining === 0) {
        stop()
        sound.end.play()
      }

      const seconds = Math.ceil(remaining / 1000)
      if (
        !playedBeeps.includes(seconds) &&
        (seconds === Math.ceil(duration / 1000) || beeps.includes(seconds))
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

  let broadcastLimit = 1 // rps
  let lastBroadcast: number = 0
  function trackTime() {
    if (Date.now() - lastBroadcast > broadcastLimit * 1000) {
      channel.track(time)
      lastBroadcast = Date.now()
    }
  }

  $: {
    if (status === 'started') {
      status = 'running'
      tick()
    }
  }
</script>

<div
  class={`border-2 border-transparent font-mono text-[15vw] ${
    status !== 'running' ? 'rounded border-stone-200 px-10' : ''
  }`}
  contenteditable={status !== 'running'}
  on:blur={handleDurationChange}
>
  {[
    String(time.seconds + time.milliseconds / 1000 > 59 ? time.minutes + 1 : time.minutes).padStart(
      2,
      '0'
    ),
    String(Math.ceil(time.seconds + time.milliseconds / 1000) % 60).padStart(2, '0')
  ].join(':')}
</div>

{#if !viewMode}
  <div class="flex gap-10 text-4xl">
    {#if status === 'stopped'}
      <Button class="bg-emerald-200 px-10 py-5" on:click={() => start()}><Play /></Button>
    {:else}
      <Button class="bg-orange-200 px-10 py-5" on:click={() => stop()}><Stop /></Button>
    {/if}
    <Button class="px-10 py-5" on:click={() => reset()}><ArrowCounterClockwise /></Button>
    <a href={`/${id}`} target="_blank" rel="noreferrer">
      <Button class="px-10 py-5"><Eye /></Button>
    </a>
  </div>
{/if}
