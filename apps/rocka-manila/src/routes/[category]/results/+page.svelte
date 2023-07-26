<script lang="ts">
  import { page } from '$app/stores'
  import { qualisScore } from '$lib/rules'
  import { stores } from '$lib/tinybase'
  import { DataTable, Tag, Tile } from 'carbon-components-svelte'
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
        score: getScore(tallies).toFixed(2),
        problems: getProblems(tallies),
      }
    })
    .sort((a, b) => b.score - a.score)

  const getTallies = (competitorId) =>
    relationships
      .getLocalRowIds('qualis_competitors', competitorId)
      .map((tallyId) => tallies[tallyId])
  const getScore = (tallies) =>
    tallies.map((tally) => qualisScore(tally)).reduce((a, b) => a + b, 0)
  const getProblems = (tallies) =>
    tallies
      .sort((a, b) => parseFloat(a.problem) - parseFloat(b.problem))
      .map((tally) => `${tally.problem}: ${qualisScore(tally)} pts`)
</script>

<Tile light>
  <div class="flex flex-col gap-5">
    <h1 class="uppercase">{$page.data.category} Qualis</h1>
    <DataTable
      headers={[
        { key: 'bib', value: 'Bib' },
        { key: 'name', value: 'Name' },
        { key: 'score', value: 'Score' },
        { key: 'problems', value: 'Problems' },
      ]}
      rows={results}
    >
      <svelte:fragment slot="cell" let:row let:cell>
        {#if cell.key === 'problems'}
          {#each cell.value as problem}
            <Tag>{problem}</Tag>
          {/each}
        {:else}
          {cell.value}
        {/if}
      </svelte:fragment>
    </DataTable>
  </div>
</Tile>
