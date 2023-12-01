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

  const getDurationParts = (timeOrMs: TimeComponents | number) => {
    const time = typeof timeOrMs === 'number' ? parseMs(timeOrMs) : timeOrMs
    return [
      time.days * 24 + time.hours > 0
        ? String(Math.trunc(time.days * 24 + time.hours)).padStart(2, '0')
        : null,
      String(Math.trunc(time.minutes)).padStart(2, '0'),
      String(Math.trunc(time.seconds + time.milliseconds / 1000)).padStart(
        2,
        '0',
      ),
    ].filter((p) => p !== null)
  }

  export const formatDuration = (timeOrMs: TimeComponents | number) => {
    return getDurationParts(timeOrMs).join(':')
  }
</script>

<script lang="ts">
  import toMilliseconds from '@sindresorhus/to-milliseconds'
  import { nanoid } from 'nanoid'
  import parseMs, { type TimeComponents } from 'parse-ms'
  import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise'
  import Play from 'phosphor-svelte/lib/Play'
  import Stop from 'phosphor-svelte/lib/Stop'
  import { createEventDispatcher } from 'svelte'
  import Button from './Button.svelte'

  type Status = 'started' | 'running' | 'stopped'

  let endTime: number
  let elapsed = 0
  let status: Status = 'stopped'

  export let duration = 5 * 60 * 1000
  let time = parseMs(duration)

  $: {
    time = parseMs(duration)
    elapsed = 0
  }

  $: durationParts = getDurationParts(time)

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
    dispatch('start')
  }

  export const stop = () => {
    const remaining = endTime - Date.now()
    elapsed = duration - remaining
    status = 'stopped'
    dispatch('stop')
  }

  export const reset = () => {
    time = parseMs(duration)
    elapsed = 0
    status = 'stopped'
    playedBeeps = []
    dispatch('reset')
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
        dispatch('end')
      }

      if (
        !playedBeeps.includes(seconds) &&
        (seconds === Math.trunc(duration / 1000) || beeps.includes(seconds))
      ) {
        dispatch('beep', { seconds })
        playedBeeps = [...playedBeeps, seconds]
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
</script>

<div class="flex text-[30vw] leading-none" on:blur={handleDurationChange}>
  {#each durationParts as part, i}
    <div class="w-[40vw]">{part}</div>
    {#if i < durationParts.length - 1}
      <div>:</div>
    {/if}
  {/each}
</div>

{#if !viewMode}
  <div class="flex gap-10 text-4xl">
    {#if status === 'stopped'}
      <slot name="start" {start}>
        <Button
          class="!bg-emerald-200 px-10 py-5 !hover:bg-emerald-300"
          on:click={() => start()}
        >
          <Play />
        </Button>
      </slot>
    {:else}
      <slot name="stop" {stop}>
        <Button
          class="!bg-orange-200 px-10 py-5 !hover:bg-orange-300"
          on:click={() => stop()}
        >
          <Stop />
        </Button>
      </slot>
    {/if}
    <slot name="reset" {reset}>
      <Button class="px-10 py-5" on:click={() => reset()}>
        <ArrowCounterClockwise />
      </Button>
    </slot>
  </div>
{/if}
