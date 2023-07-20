<script lang="ts">
  import { page } from '$app/stores'
  import { listTable, store } from '$lib/tinybase'
  import { Button, Column, Grid, RadioTile, Row, Tile, TileGroup } from 'carbon-components-svelte'
  import { onDestroy, onMount } from 'svelte'
  import Tally from './tally.svelte'

  const problems = Array(15)
    .fill(null)
    .map((_, i) => ({ score: String(i + 1) }))

  let competitors = store.getTable('competitors')

  let listeners: string[] = []
  onMount(() => {
    listeners.push(
      store.addTableListener('competitors', () => {
        competitors = store.getTable('competitors')
      })
    )
  })
  onDestroy(() => {
    listeners.forEach((listenerId) => store.delListener(listenerId))
  })

  let selectedCompetitor: any
  let selectedProblem: any

  const selectCompetitor = (e: any) => {
    selectedCompetitor = e.detail
  }

  const selectProblem = (e: any) => {
    selectedProblem = e.detail
  }
</script>

<Grid padding>
  <Row>
    <Column lg={4}>
      <h1 class="uppercase">{$page.params.category} Qualis</h1>
      <br />
      <TileGroup legend="Competitor" on:select={selectCompetitor}>
        {#each listTable(competitors) as competitor}
          <RadioTile value={competitor}>
            {competitor.bib}: {competitor.name}
          </RadioTile>
        {/each}
      </TileGroup>
    </Column>
    {#if selectedCompetitor}
      <Column lg={4}>
        <h2>{selectedCompetitor.bib}: {selectedCompetitor.name}</h2>
        <br />
        <TileGroup legend="Problem" on:select={selectProblem}>
          {#each problems as problem, i}
            <RadioTile value={problem.score}>{problem.score}</RadioTile>
          {/each}
        </TileGroup>
      </Column>
    {/if}
    {#if selectedProblem}
      <Column>
        <Tally competitor={selectedCompetitor} problem={selectedProblem} />
      </Column>
    {/if}
  </Row>
</Grid>

<div class="fixed inset-0 pointer-events-none">
  <div class="absolute bottom-5 right-5 pointer-events-auto">
    <a href={`/${$page.params.category}/results/qualis`}>
      <Button>Results &rarr;</Button>
    </a>
  </div>
</div>
