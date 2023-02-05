<script>
  import { browser } from '$app/environment'
  import { currentTimer, timerQueue } from '$lib/stores'
  import { Button, formatDuration, Logo, parseDuration, Timer } from '@tallytop/ui'
  import Plus from 'phosphor-svelte/lib/Plus'
  import Queue from 'phosphor-svelte/lib/Queue'

  let { description, duration } = $timerQueue[$currentTimer]

  const updateTimerDescription = (v, i) => {
    timerQueue.update((value) => {
      value[i].description = v
      return value
    })
  }

  const updateTimerDuration = (v, i) => {
    timerQueue.update((value) => {
      value[i].duration = typeof v === 'string' ? parseDuration(v) : v
      return value
    })
  }

  let queueShown = false
  const toggleQueue = () => (queueShown = !queueShown)

  $: {
    description = $timerQueue[$currentTimer].description
    duration = $timerQueue[$currentTimer].duration
  }
</script>

<div class="flex min-h-screen flex-1">
  <div class="absolute top-5 left-2">
    <Button variant="none" class="text-2xl" on:click={toggleQueue}>
      <div class:opacity-20={!queueShown}>
        <Queue />
      </div>
    </Button>
  </div>
  {#if queueShown}
    <div class="flex flex-col gap-2 bg-stone-50 p-5 pt-16">
      {#each $timerQueue as { description, duration }, i}
        <div class="flex gap-5 px-5 leading-loose">
          <div class="text-stone-300">{i + 1}</div>
          <input
            class="bg-transparent"
            type="text"
            value={description}
            on:change={(e) => updateTimerDescription(e.target.value, i)}
          />
          <input
            class="w-14 bg-transparent font-mono"
            type="text"
            value={formatDuration(duration)}
            on:change={(e) => updateTimerDuration(e.target.value, i)}
          />
        </div>
      {/each}
      <Button class="flex items-center gap-2"><Plus /> New timer</Button>
    </div>
  {/if}
  <div class="flex flex-1 flex-col items-center justify-center gap-10 bg-white shadow-xl">
    <Logo width="128" />
    <Timer
      {duration}
      {browser}
      onChange={({ duration }) => updateTimerDuration(duration, $currentTimer)}
    />
    <div class="text-2xl">{description}</div>
  </div>
</div>
