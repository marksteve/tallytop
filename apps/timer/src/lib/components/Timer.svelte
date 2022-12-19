<script lang="ts">
  import { Button } from '@tallytop/ui'
  import { Howl } from 'howler'
  import parseMs from 'parse-ms'
  import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise'
  import Play from 'phosphor-svelte/lib/play'
  import Stop from 'phosphor-svelte/lib/stop'

  let endTime: number
  let elapsed = 0
  let status = 'stopped'

  export let duration = 5 * 60 * 1000
  let time = parseMs(duration)

  const sound = {
    beep: new Howl({ src: '/sounds/beep.mp3' }),
    end: new Howl({ src: '/sounds/end.mp3' })
  }
  export let beeps = [0, 60, 5, 4, 3, 2, 1]
  let playedBeeps: number[] = []

  export let viewMode = false

  function start() {
    endTime = Date.now() + duration - elapsed
    status = 'started'
  }

  function stop() {
    const remaining = endTime - Date.now()
    elapsed = duration - remaining
    status = 'stopped'
  }

  function reset() {
    time = parseMs(duration)
    elapsed = 0
    status = 'stopped'
    playedBeeps = []
  }

  function tick() {
    if (status === 'running') {
      let remaining = endTime - Date.now()

      if (remaining < 0) {
        remaining = 0
      }
      if (remaining === 0) {
        stop()
        sound.end.play()
      }

      time = parseMs(remaining)

      const seconds = Math.ceil(remaining / 1000)

      if (
        !playedBeeps.includes(seconds) &&
        (seconds === Math.ceil(duration / 1000) || beeps.includes(seconds))
      ) {
        sound.beep.play()
        playedBeeps = [...playedBeeps, seconds]
      }

      requestAnimationFrame(tick)
    }
  }

  $: {
    if (status === 'started') {
      status = 'running'
      tick()
    }
  }
</script>

<div class="font-mono text-[15vw]">
  {[
    String(
      time.seconds + time.milliseconds / 1000 > 59 ? time.minutes + 1 : time.minutes
    ).padStart(2, '0'),
    String(Math.ceil(time.seconds + time.milliseconds / 1000) % 60).padStart(2, '0')
  ].join(':')}
</div>

{#if !viewMode}
<div class="flex gap-10 text-4xl">
  {#if status === 'stopped'}
    <Button class="bg-emerald-200 px-10 py-5" on:click={start}><Play /></Button>
  {:else}
    <Button class="bg-orange-200 px-10 py-5" on:click={stop}><Stop /></Button>
  {/if}
  <Button class="px-10 py-5" on:click={reset}><ArrowCounterClockwise /></Button>
</div>
{/if}