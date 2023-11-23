<script lang="ts">
  import type { Writable } from 'svelte/store'
  import Button from './Button.svelte'
  import { attemptsToText } from './attempts.js'
  import { scoreModal } from './variants.js'

  export let attempts: Writable<string>
  export let isSaved: Writable<boolean>

  export let labels = {
    a: 'Attempt',
    z: 'Zone',
    t: 'Top',
  }

  export let icons: Record<string, string> = {
    a: '/attempt.svg',
    z: '/zone.svg',
    t: '/top.svg',
  }

  const attempt = () => {
    $attempts = $attempts + 'a'
    $isSaved = false
  }

  const zone = () => {
    $attempts = $attempts.slice(0, -1) + ($attempts.endsWith('z') ? 'a' : 'z')
    $isSaved = false
  }

  const top = () => {
    $attempts = $attempts.slice(0, -1) + ($attempts.endsWith('t') ? 'a' : 't')
    $isSaved = false
  }

  const erase = () => {
    $attempts = $attempts.slice(0, -1)
    $isSaved = false
  }

  const actions: Record<string, () => void> = {
    a: attempt,
    z: zone,
    t: top,
  }

  let fullScore = false

  const toggleFullScore = () => {
    fullScore = !fullScore
  }
</script>

<div class="flex flex-col items-center justify-center gap-1 bg-white">
  <div class="flex h-8 flex-wrap justify-center gap-2 p-4">
    {#each $attempts as attempt}
      <img src={icons[attempt]} alt={attempt} />
    {/each}
  </div>
  <div class={scoreModal({ fullScore })} on:click={toggleFullScore}>
    {attemptsToText($attempts)}
  </div>
  <div class="grid grid-cols-3 gap-x-1 gap-y-4">
    {#each Object.entries(labels) as [key, label]}
      <Button on:click={actions[key]} class="text-3xl">{label}</Button>
    {/each}
    <Button on:click={erase} class="col-start-2">Erase</Button>
  </div>
</div>
