<script lang="ts">
  import type { PageData } from './$types'

  let attempts = ''

  const addFail = () => (attempts += 'x')
  const addZone = () => (attempts += 'z')
  const addTop = () => (attempts += 't')
  const removeAttempt = () => (attempts = attempts.slice(0, attempts.length - 1))

  $: zone = attempts.indexOf('z') + 1 || top
  $: top = attempts.indexOf('t') + 1

  export let data: PageData
</script>

<div class="text-4xl">
  <a href="/judge/finals/{data.problem?.id}">{data.problem?.wall}</a>
  / {data.team?.name}
</div>

<div class="text-roc-yellow flex h-10 items-center justify-center gap-2">
  {#each attempts as attempt}
    {#if attempt == 'z'}
      <div class="flex h-10 w-5 flex-col justify-end border-2 border-current">
        <div class="h-1/2 bg-current" />
      </div>
    {:else if attempt == 't'}
      <div class="h-10 w-5 bg-current" />
    {:else}
      <div class="h-10 w-5 border-2 border-current" />
    {/if}
  {/each}
</div>

<div class="text-roc-black flex w-2/3 text-center leading-none">
  <div class="flex-1 -rotate-6">
    <div class="text-2xl">Zone</div>
    <div class="font-sans font-black">{zone}</div>
  </div>
  <div class="flex-1 rotate-6">
    <div class="text-2xl">Top</div>
    <div class="font-sans font-black">{top}</div>
  </div>
</div>

<div class="text-roc-black grid aspect-square w-1/2 grid-cols-2 gap-10 text-2xl">
  <button class="bg-roc-yellow" on:click={addZone}>Zone</button>
  <button class="bg-roc-yellow" on:click={addTop}>Top</button>
  <button class="bg-roc-yellow font-sans text-3xl" on:click={removeAttempt}>-</button>
  <button class="bg-roc-yellow font-sans text-3xl" on:click={addFail}>+</button>
</div>
