<script lang="ts">
  import parseMs from 'parse-ms'
  import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise'
  import Play from 'phosphor-svelte/lib/play'
  import Stop from 'phosphor-svelte/lib/stop'
  import { Button } from 'ui'

  let endTime: number
  let elapsed = 0
  let status = 'stopped'

  let duration = 5 * 60 * 1000
  let time = parseMs(duration)

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
  }

  function tick() {
    if (status === 'running') {
      let remaining = endTime - Date.now()
      if (remaining < 0) {
        remaining = 0
      }
      time = parseMs(remaining)
      if (remaining === 0) {
        stop()
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

<div class="flex min-h-screen flex-1 flex-col items-center justify-center gap-10">
  <img src="/images/logo.svg" width={128} alt="Logo" />
  <div class="font-mono text-[15vw]">
    {[
      String(
        time.seconds + time.milliseconds / 1000 > 59 ? time.minutes + 1 : time.minutes
      ).padStart(2, '0'),
      String(Math.ceil(time.seconds + time.milliseconds / 1000) % 60).padStart(2, '0')
    ].join(':')}
  </div>
  <div class="flex gap-10 text-4xl">
    {#if status === 'stopped'}
      <Button class="bg-emerald-200 px-10 py-5" on:click={start}><Play /></Button>
    {:else}
      <Button class="bg-orange-200 px-10 py-5" on:click={stop}><Stop /></Button>
    {/if}
    <Button class="px-10 py-5" on:click={reset}><ArrowCounterClockwise /></Button>
  </div>
</div>
