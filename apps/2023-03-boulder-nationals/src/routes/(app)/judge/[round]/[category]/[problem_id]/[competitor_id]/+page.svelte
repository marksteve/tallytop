<script lang="ts">
  import { applyAction, enhance } from '$app/forms'
  import Button from '$lib/ui/Button.svelte'
  import failIcon from '../../fail.svg'
  import topIcon from '../../top.svg'
  import zoneIcon from '../../zone.svg'
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

<div class="p-5 text-center text-4xl font-bold uppercase text-white">
  <div class="text-6xl">
    {data.problem.wall}
  </div>
  {data.competitor?.first_name ?? ''}
  {data.competitor?.last_name ?? ''}
</div>

<div class="flex flex-col gap-5">
  <div class="flex h-10 items-center justify-center gap-2 px-5 text-white">
    {#each attempts as attempt}
      {#if attempt == 'z'}
        <img src={zoneIcon} class="h-12" />
      {:else if attempt == 't'}
        <img src={topIcon} class="h-12" />
      {:else}
        <img src={failIcon} class="h-12" />
      {/if}
    {/each}
  </div>

  <div class="text-center text-6xl font-bold text-white">
    T{top} Z{zone}
  </div>
</div>

<div class="text-brand row-span-2 grid aspect-square w-1/2 auto-rows-fr grid-cols-2 gap-5">
  <button class="rounded-xl bg-white text-3xl font-bold" on:click={addTop}>TOP</button>
  <button class="rounded-xl bg-white text-3xl font-bold" on:click={addZone}>ZONE</button>
  <button class="rounded-xl bg-white text-6xl" on:click={removeAttempt}>-</button>
  <button class="rounded-xl bg-white text-6xl" on:click={addFail}>+</button>
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
  <Button type="submit">
    {#if saved}SAVED{:else}SAVE{/if}
  </Button>
</form>
