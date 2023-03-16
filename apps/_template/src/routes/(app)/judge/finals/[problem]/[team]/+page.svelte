<script lang="ts">
  import { applyAction, enhance } from '$app/forms'
  import Lightning from 'phosphor-svelte/lib/Lightning'
  import type { PageData } from './$types'

  export let data: PageData

  let attempts = data.attempts ?? ''

  const addFail = () => (attempts += 'x')
  const addZone = () => (attempts += 'z')
  const addTop = () => (attempts += 't')
  const removeAttempt = () => (attempts = attempts.slice(0, attempts.length - 1))

  $: zone = attempts.indexOf('z') + 1 || top
  $: top = attempts.indexOf('t') + 1

  let saved = false
  $: {
    attempts
    saved = false
  }
</script>

<div class="px-5 text-4xl">
  <a href="/judge/finals/{data.problem?.id}">{data.problem?.wall}</a>
  /<br />{data.team?.name}
</div>

<div class="flex h-10 w-full items-center justify-center px-5">
  {#each attempts as attempt}
    {#if attempt == 'z'}
      <Lightning weight="duotone" />
    {:else if attempt == 't'}
      <Lightning weight="fill" />
    {:else}
      <Lightning weight="thin" />
    {/if}
  {/each}
</div>

<div class="flex w-2/3 text-center leading-none md:w-1/3">
  <div class="flex-1 -rotate-6">
    <div class="text-2xl">Zone</div>
    <div>{zone}</div>
  </div>
  <div class="flex-1 rotate-6">
    <div class="text-2xl">Top</div>
    <div>{top}</div>
  </div>
</div>

<div class="grid aspect-square w-1/2 grid-cols-2 gap-10 text-2xl md:w-1/4">
  <button on:click={addZone}>Zone</button>
  <button on:click={addTop}>Top</button>
  <button on:click={removeAttempt}>-</button>
  <button on:click={addFail}>+</button>
</div>

<form
  method="POST"
  use:enhance={() =>
    async ({ result }) => {
      await applyAction(result)
      saved = true
    }}
>
  <input type="hidden" name="attempts" value={attempts} />
  <input type="hidden" name="zone" value={zone} />
  <input type="hidden" name="top" value={top} />
  <button type="submit">
    {#if saved}Saved{:else}Save{/if}
  </button>
</form>
