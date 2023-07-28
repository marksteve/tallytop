<script lang="ts">
  import { page } from '$app/stores'
  import { stores, listTable } from '$lib/tinybase'
  import { Column, Grid, RadioTile, Row, TileGroup } from 'carbon-components-svelte'
  import { onDestroy, onMount } from 'svelte'
  import Tally from './tally.svelte'

  const { store } = $stores[$page.params.category]

  const problems = $page.data.problems[$page.params.category].map(String)

  let competitors = store.getTable('competitors')
  let tallies = store.getTable('finals_tally')

  let listeners: string[]
  onMount(() => {
    listeners = [
      store.addTableListener('competitors', () => {
        competitors = store.getTable('competitors')
      }),
      store.addTableListener('finals_tally', () => {
        tallies = store.getTable('finals_tally')
      }),
    ]
  })
  onDestroy(() => {
    listeners.forEach((listenerId) => store.delListener(listenerId))
  })

  let selectedProblem: any
  let selectedCompetitor: any

  $: {
    selectedProblem
    selectedCompetitor = undefined
  }

  const selectProblem = (e: any) => {
    selectedProblem = e.detail
  }

  const selectCompetitor = (e: any) => {
    selectedCompetitor = e.detail
  }
</script>

<Grid padding>
  <Row>
    <Column>
      <h1 class="uppercase">{$page.data.category} Finals</h1>
    </Column>
  </Row>
  <Row>
    <Column lg={4}>
      <TileGroup legend="Select a problem" on:select={selectProblem} selected={selectedProblem}>
        {#each problems as problem}
          <RadioTile value={problem}>{problem}</RadioTile>
        {/each}
      </TileGroup>
    </Column>
    {#if selectedProblem}
      <Column lg={4}>
        <h2>
          Problem {selectedProblem}
        </h2>
        <br />
        <TileGroup legend="Select a competitor" on:select={selectCompetitor}>
          {#each listTable(competitors) as competitor}
            <RadioTile value={competitor}>
              {competitor.bib}: {competitor.name}
            </RadioTile>
          {/each}
        </TileGroup>
      </Column>
    {/if}
    {#if selectedCompetitor}
      <Column>
        <Tally {store} competitor={selectedCompetitor} problem={selectedProblem} />
      </Column>
    {/if}
  </Row>
</Grid>
