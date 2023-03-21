<script lang="ts">
  import { applyAction, enhance } from '$app/forms'
  import { page } from '$app/stores'
  import Button from '$lib/ui/Button.svelte'
  import * as R from 'ramda'
  import failIcon from '../../fail.svg'
  import topIcon from '../../top.svg'
  import zoneIcon from '../../zone.svg'
  import type { PageData } from './$types'

  export let data: PageData

  const addFail = () => (attempts += 'x')
  const addZone = () => (attempts += 'z')
  const addTop = () => (attempts += 't')
  const removeAttempt = () => (attempts = attempts.slice(0, attempts.length - 1))

  $: attempts = data.climbs?.attempts ?? ''
  $: zone = attempts.indexOf('z') + 1 || top
  $: top = attempts.indexOf('t') + 1

  let saved = false
  $: {
    attempts
    saved = false
  }

  let competitor, prev, next
  $: {
    competitor = R.find(R.propEq('id', data.competitor?.id), data.competitors)
    prev = R.find(R.propEq('order', competitor?.order - 1), data.competitors)
    next = R.find(R.propEq('order', competitor?.order + 1), data.competitors)
  }

  const { params } = $page
</script>

<div class="justify-self-stretch px-5 font-bold uppercase text-white md:justify-self-center">
  <div class="flex items-center gap-5">
    <div class="text-4xl">
      {data.problem.wall}
    </div>
    <div class="text-brand w-14 rounded-full bg-white text-center text-2xl">
      {competitor.bib_number}
    </div>
    <div class="flex-1 text-xl leading-none">
      {data.competitor?.first_name ?? ''}
      {data.competitor?.last_name ?? ''}
    </div>
  </div>
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

<div
  class="text-brand row-span-2 grid aspect-square w-1/2 auto-rows-fr grid-cols-2 gap-5 md:max-w-xs"
>
  <button class="rounded-xl bg-white text-3xl font-bold" on:click={addTop}>TOP</button>
  <button class="rounded-xl bg-white text-3xl font-bold" on:click={addZone}>ZONE</button>
  <button class="rounded-xl bg-white text-6xl" on:click={removeAttempt}>-</button>
  <button class="rounded-xl bg-white text-6xl" on:click={addFail}>+</button>
</div>

<div class="grid grid-cols-3 justify-items-center justify-self-stretch px-10">
  {#if prev}
    <a href={`/judge/${params.round}/${params.category}/${params.problem_id}/${prev.id}`}>
      <Button>PREV</Button>
    </a>
  {:else}
    <div />
  {/if}
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
  {#if next}
    <a href={`/judge/${params.round}/${params.category}/${params.problem_id}/${next.id}`}>
      <Button>NEXT</Button>
    </a>
  {:else}
    <div />
  {/if}
</div>
