<script lang="ts">
  import { page } from '$app/stores'
  import { categories } from '$lib/constants'
  import { qualisProblemsCutoff, qualisScore } from '$lib/rules'
  import { stores } from '$lib/tinybase'
  import { formatScore } from '$lib/utils'
  import { onDestroy, onMount } from 'svelte'

  const { store, relationships } = $stores[$page.params.category]

  let competitors = store.getTable('competitors')
  let tallies = store.getTable('qualis_tally')

  let listeners: string[]
  onMount(() => {
    listeners = [
      store.addTableListener('competitors', () => {
        competitors = store.getTable('competitors')
      }),
      store.addTableListener('qualis_tally', () => {
        tallies = store.getTable('qualis_tally')
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
      const tallies = getTallies(id)
      return {
        id,
        bib: competitor.bib,
        name: competitor.name,
        score: formatScore(getScore(tallies)),
        problems: getProblems(tallies),
      }
    })
    .sort((a, b) => b.score - a.score)

  const getTallies = (competitorId) =>
    relationships
      .getLocalRowIds('qualis_competitors', competitorId)
      .map((tallyId) => tallies[tallyId])

  const getScore = (tallies) =>
    tallies
      .sort((a, b) => qualisScore(b) - qualisScore(a))
      .slice(0, qualisProblemsCutoff)
      .map((tally) => qualisScore(tally))
      .reduce((a, b) => a + b, 0)

  const getProblems = (tallies) =>
    tallies
      .sort((a, b) => qualisScore(b) - qualisScore(a))
      .map((tally, i) => ({
        name: tally.problem,
        score: formatScore(qualisScore(tally)),
        counted: i < qualisProblemsCutoff,
      }))

  const setCategory = (e) => {
    location.href = `/${e.target.value}/results/qualis`
  }
</script>

<div class="flex flex-col gap-5 bg-rockamanila-bg min-h-screen items-center p-5">
  <div class="max-w-sm flex flex-col gap-3">
    <img src="/images/rocka-manila-logo.png" alt="Rocka Manila" />
    <img src="/images/qualis.svg" alt="Qualis" />
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
    {#each results as result}
      <img src="/images/line.svg" alt="Line" />
      <div class="flex text-rockamanila-green text-2xl p-2 gap-1">
        <div class="w-16">{result.bib}</div>
        <div class="flex-1">{result.name}</div>
        <div
          class="text-rockamanila-magenta flex flex-col w-1/4 lg:flex-row lg:items-center lg:w-1/3"
        >
          <div class="w-1/3">{result.score}</div>
          <div class="flex gap-1 items-center flex-wrap">
            {#each result.problems as problem}
              <div
                class="text-sm rounded-full bg-rockamanila-green text-rockamanila-bg w-5 text-center"
                class:opacity-20={!problem.counted}
                title={problem.score}
              >
                {problem.name}
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/each}
    <img src="/images/line.svg" alt="Line" class="rotate-180" />
  </div>
</div>
