<script lang="ts">
  import { browser } from '$app/environment'
  import { currentTimer, timerQueue } from '$lib/stores'
  import { Button, formatDuration, Logo, Timer } from '@tallytop/ui'
  import Backspace from 'phosphor-svelte/lib/Backspace'
  import Plus from 'phosphor-svelte/lib/Plus'
  import Queue from 'phosphor-svelte/lib/Queue'
  import Repeat from 'phosphor-svelte/lib/Repeat'
  import { tick } from 'svelte'

  let queueShown = false
  const toggleQueue = () => (queueShown = !queueShown)

  let { description, duration } = $timerQueue[$currentTimer]

  $: {
    description = $timerQueue[$currentTimer].description
    duration = $timerQueue[$currentTimer].duration
  }

  let currentTimerDescription: HTMLInputElement

  const handleNewTimer = async () => {
    timerQueue.newTimer()
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

    if (!queueEnded || repeat) {
      timer?.start()
    }
  }

  let repeat = false

  const toggleRepeat = () => {
    repeat = !repeat
  }
</script>

<div class="flex min-h-screen flex-1 text-stone-800">
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
        <div class="group flex items-center gap-5 px-5 leading-loose">
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
            on:change={(e) => timerQueue.updateTimerDescription(i, e.target.value)}
            bind:this={currentTimerDescription}
          />
          <input
            class="w-14 bg-transparent font-mono"
            type="text"
            value={formatDuration(duration)}
            on:change={(e) => timerQueue.updateTimerDuration(i, e.target.value)}
          />
          <button
            class="opacity-0 group-hover:opacity-100"
            on:click={() => timerQueue.removeTimer(i)}
          >
            <Backspace />
          </button>
        </div>
      {/each}
      <div class="flex gap-5">
        <Button class="flex flex-1 items-center justify-center gap-2" on:click={handleNewTimer}>
          <Plus /> New timer
        </Button>
        <Button
          class="flex flex-1 items-center justify-center gap-2 bg-transparent {repeat
            ? ''
            : 'opacity-20'}"
          on:click={toggleRepeat}
        >
          <Repeat /> Repeat
        </Button>
      </div>
    </div>
  {/if}

  <div class="flex flex-1 flex-col items-center justify-center gap-10 bg-white shadow-xl">
    <div class="flex flex-col items-center gap-2 text-3xl font-black">
      <Logo width="128" /> Tallytop
    </div>
    <Timer
      {duration}
      {browser}
      bind:this={timer}
      on:changeduration={({ detail: { duration } }) => {
        timerQueue.updateTimerDuration($currentTimer, duration)
      }}
      on:end={setNextTimer}
    />
    <div class="text-2xl">{description}</div>
  </div>
</div>
