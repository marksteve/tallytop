<script lang="ts">
  import parseMs from 'parse-ms'
  import ArrowCounterClockwise from 'phosphor-svelte/lib/ArrowCounterClockwise'
  import Play from 'phosphor-svelte/lib/play'
  import Stop from 'phosphor-svelte/lib/stop'
  import { Button } from 'ui'

  let duration = 5 * 60 * 1000
  let time = duration
  let { minutes, seconds, milliseconds } = parseMs(time)
  let status = 'stopped'
</script>

<div class="flex min-h-screen flex-1 flex-col items-center justify-center gap-10">
  <img src="/images/logo.svg" width={128} alt="Logo" />
  <div class="font-mono text-[15vw]">
    {[
      String(seconds + milliseconds / 1000 > 59 ? minutes + 1 : minutes).padStart(2, '0'),
      String(Math.ceil(seconds + milliseconds / 1000) % 60).padStart(2, '0')
    ].join(':')}
  </div>
  <div class="flex gap-10 text-4xl">
    {#if status === 'running'}
      <Button class="bg-orange-200 px-10 py-5"><Stop /></Button>
    {:else}
      <Button class="bg-emerald-200 px-10 py-5"><Play /></Button>
    {/if}
    <Button class="px-10 py-5"><ArrowCounterClockwise /></Button>
  </div>
</div>
