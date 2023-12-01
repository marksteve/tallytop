<script lang="ts">
  import { browser } from '$app/environment'
  import Button from '$lib/components/Button.svelte'
  import Timer, { formatDuration } from '$lib/components/Timer.svelte'
  import { currentTimer, timerQueue } from '$lib/stores'
  import Backspace from 'phosphor-svelte/lib/Backspace'
  import Plus from 'phosphor-svelte/lib/Plus'
  import Queue from 'phosphor-svelte/lib/Queue'
  import Repeat from 'phosphor-svelte/lib/Repeat'
  import { onMount, tick } from 'svelte'

  let sound: import('@pixi/sound').SoundLibrary
  onMount(async () => {
    sound = (await import('@pixi/sound')).sound
    sound.add('beep', '/sounds/beep.mp3')
    sound.add('end', '/sounds/end.mp3')
  })

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

  let timer: Timer

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

  let running = false

  const handleStart = () => {
    running = true
    sound.play('beep')
  }

  const handleStop = () => {
    running = false
  }

  const handleBeep = (e: CustomEvent<{ seconds: number }>) => {
    if (e.detail.seconds === 60) {
      sound.play('beep')
    }
    if (e.detail.seconds <= 5) {
      sound.play('beep')
    }
  }

  const handleEnd = () => {
    running = false
    sound.play('end')
    setNextTimer()
  }
</script>

<div class="flex min-h-screen flex-1 overflow-hidden">
  {#if !running}
    <div class="absolute left-2 top-5">
      <Button variant="none" class="text-2xl" on:click={toggleQueue}>
        <div class="flex items-center gap-5" class:opacity-20={!queueShown}>
          <Queue />
          Edit timers
        </div>
      </Button>
    </div>
  {/if}

  {#if queueShown}
    <div class="max-h-screen min-w-fit overflow-y-auto bg-stone-50 p-5 pt-14">
      <div class="flex flex-col gap-2 py-5">
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
              placeholder="Enter description"
              on:change={(e) =>
                timerQueue.updateTimerDescription(i, e.target.value)}
              bind:this={currentTimerDescription}
            />
            <input
              class="w-20 bg-transparent tabular-nums"
              type="text"
              value={formatDuration(duration)}
              on:change={(e) =>
                timerQueue.updateTimerDuration(i, e.target.value)}
            />
            <button
              class="opacity-0 group-hover:opacity-100"
              on:click={() => timerQueue.removeTimer(i)}
            >
              <Backspace />
            </button>
          </div>
        {/each}
      </div>
      <div class="flex gap-5">
        <Button
          class="flex flex-1 items-center justify-center gap-2"
          on:click={handleNewTimer}
        >
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

  <div
    class="flex flex-1 flex-col items-center justify-center gap-5 p-5 shadow-xl"
  >
    <Timer
      {duration}
      {browser}
      bind:this={timer}
      on:changeduration={({ detail: { duration } }) => {
        timerQueue.updateTimerDuration($currentTimer, duration)
      }}
      on:start={handleStart}
      on:stop={handleStop}
      on:beep={handleBeep}
      on:end={handleEnd}
    />
    <div class="text-2xl">{description}</div>
  </div>
</div>
