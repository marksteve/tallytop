<script lang="ts">
  import { page } from '$app/stores'
  import { categories } from '$lib/constants'
  import { podiumCutoff } from '$lib/rules'
  import { synced } from '$lib/stores'
  import { stores } from '$lib/tinybase'
  import { onDestroy, onMount } from 'svelte'
  import attemptIcon from './attempt.svg'
  import zoneIcon from './zone.svg'
  import topIcon from './top.svg'

  const { store, relationships } = $stores[$page.params.category]

  let competitors = {}
  let settings = {}
  let tallies = {}
  $: if ($synced) {
    competitors = store.getTable('competitors')
    settings = store.getTable('settings')
    tallies = store.getTable('finals_tally')
  }

  let listeners: string[]
  onMount(() => {
    listeners = [
      store.addTableListener('competitors', () => {
        competitors = store.getTable('competitors')
      }),
      store.addTableListener('settings', () => {
        settings = store.getTable('settings')
      }),
      store.addTableListener('finals_tally', () => {
        tallies = store.getTable('finals_tally')
      }),
    ]
  })
  onDestroy(() => {
    listeners.forEach((listenerId) => {
      store.delListener(listenerId)
    })
  })

  $: results = Object.entries(competitors)
    .map(([id, competitor]) => {
      const problems = Object.fromEntries(getTallies(id).map((tally) => [
        tally.problem,
        tally
      ]))
      return {
        id,
        bib: competitor.bib,
        name: competitor.name,
        problems,
      }
    })
    .sort((a, b) => b.score - a.score)
  $: rankShown = settings[$page.params.category]?.completed

  const getTallies = (competitorId) =>
    relationships
      .getLocalRowIds('finals_competitors', competitorId)
      .map((tallyId) => tallies[tallyId])

  const setCategory = (e) => {
    location.href = `/${e.target.value}/results/finals`
  }

  const problemIcon = (attempts: string) => {
    if (!attempts) return
    switch (true) {
      case attempts.includes('a'):
        return attemptIcon
      case attempts.includes('z'):
        return zoneIcon
      case attempts.includes('T'):
        return topIcon
    }
  }
</script>

<div class="flex flex-col gap-5 bg-rockamanila-bg min-h-screen items-center p-5">
  <div class="max-w-sm flex flex-col gap-3">
    <img src="/images/rocka-manila-logo.png" alt="Rocka Manila" />
    <img src="/images/finals.svg" alt="Qualis" />
    <img src="/images/scores.svg" alt="Scores" />
    <div class="self-center relative">
      <select
        class="appearance-none bg-transparent text-rockamanila-magenta text-4xl pr-12"
        value={$page.params.category}
        on:change={setCategory}
      >
        {#each Object.entries(categories) as [category, label]}
          <option value={category}>{label}</option>
        {/each}
      </select>
      <span
        class="pointer-events-none rounded-lg bg-rockamanila-green text-rockamanila-bg rotate-90 text-4xl px-2 pb-[6px] leading-none absolute right-0"
      >
        &gt;
      </span>
    </div>
  </div>
  <div class="max-w-screen-lg w-full">
    {#each results as result, i}
      <img src="/images/line.svg" alt="Line" />
      <div
        class="flex text-rockamanila-green text-2xl p-2 gap-1 my-1 rounded-lg"
        class:bg-rockamanila-orange={rankShown && i < podiumCutoff}
      >
        <div class="w-16">{result.bib}</div>
        <div class="flex-1">{result.name}</div>
        <div
          class="text-rockamanila-magenta flex gap-2"
        >
          {#each Array(4).keys() as problem}
            {#if problemIcon(result.problems?.[problem]?.attempts)}
              <img src={problemIcon(result.problems?.[problem]?.attempts)} alt={String(problem)} class="h-10" />
            {:else}
              <img src={problemIcon('a')} alt={String(problem)} class="opacity-10 h-10" />
            {/if}
          {/each}
        </div>
      </div>
    {/each}
    <img src="/images/line.svg" alt="Line" class="rotate-180" />
  </div>
</div>
