<script lang="ts">
  import { browser } from '$app/environment'
  import { currentTimer, timerQueue } from '$lib/stores'
  import { Button, formatDuration, Logo, parseDuration, Timer } from '@tallytop/ui'
  import Plus from 'phosphor-svelte/lib/Plus'
  import Queue from 'phosphor-svelte/lib/Queue'
  import { tick } from 'svelte'

  let queueShown = false
  const toggleQueue = () => (queueShown = !queueShown)

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

  $: {
    description = $timerQueue[$currentTimer].description
    duration = $timerQueue[$currentTimer].duration
  }

  let currentTimerDescription: HTMLInputElement

  const handleNewTimer = async () => {
    timerQueue.update((value) => [
      ...value,
      { description: 'Enter description', duration: 60 * 1000 }
    ])
    $currentTimer = $timerQueue.length - 1
    await tick()
    currentTimerDescription?.focus()
    currentTimerDescription?.select()
  }

  let timer

  const setNextTimer = async () => {
    $currentTimer++

    const queueEnded = $currentTimer >= $timerQueue.length

    if (queueEnded) {
      $currentTimer = 0
    }

    await tick()
    timer?.reset()

    if (!queueEnded) {
      timer?.start()
    }
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
        <div class="flex items-baseline gap-5 px-5 leading-loose">
          <button
            class={`flex h-5 w-5 items-center justify-center rounded-full text-xs leading-none ${
              i === $currentTimer
                ? `bg-stone-400 text-stone-50`
                : `text-stone-400 hover:bg-stone-200`
            }`}
            on:click={() => ($currentTimer = i)}
          >
            {i + 1}
          </button>
          <input
            class="bg-transparent"
            type="text"
            value={description}
            on:change={(e) => updateTimerDescription(e.target.value, i)}
            bind:this={currentTimerDescription}
          />
          <input
            class="w-14 bg-transparent font-mono"
            type="text"
            value={formatDuration(duration)}
            on:change={(e) => updateTimerDuration(e.target.value, i)}
          />
        </div>
      {/each}
      <Button class="flex items-center gap-2" on:click={handleNewTimer}><Plus /> New timer</Button>
    </div>
  {/if}

  <div class="flex flex-1 flex-col items-center justify-center gap-10 bg-white shadow-xl">
    <Logo width="128" />
    <Timer
      {duration}
      {browser}
      bind:this={timer}
      on:changeduration={({ duration }) => updateTimerDuration(duration, $currentTimer)}
      on:end={setNextTimer}
    />
    <div class="text-2xl">{description}</div>
  </div>
</div>
