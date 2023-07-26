<script lang="ts">
  import { page } from '$app/stores'
  import { listTable, relationships, store } from '$lib/tinybase'
  import { Button, Column, Grid, RadioTile, Row, TileGroup } from 'carbon-components-svelte'
  import { onDestroy, onMount } from 'svelte'
  import Tally from './tally.svelte'

  export let data: import('./$types').PageData

  const problems = data.walls[$page.params.wall].map(String)

  let competitors = store.getTable('competitors')
  let tallies = store.getTable('qualis_tally')
  let competitorTallies: any[] = []

  let listeners: string[] = []
  onMount(() => {
    listeners.push(
      store.addTableListener('competitors', () => {
        competitors = store.getTable('competitors')
      })
    )
    listeners.push(
      store.addTableListener('qualis_tally', () => {
        tallies = store.getTable('qualis_tally')
        competitorTallies = getTallies()
      })
    )
  })
  onDestroy(() => {
    listeners.forEach((listenerId) => store.delListener(listenerId))
  })

  let selectedCompetitor: any
  let selectedProblem: any

  $: {
    selectedCompetitor
    selectedProblem = undefined
  }

  $: if (selectedCompetitor) {
    competitorTallies = getTallies()
  }

  $: tops = Object.fromEntries(competitorTallies.map((tally) => [tally.problem, tally.top]))

  $: console.log(competitorTallies)

  const selectCompetitor = (e: any) => {
    selectedCompetitor = e.detail
  }

  const selectProblem = (e: any) => {
    selectedProblem = e.detail
  }

  const getTallies = () =>
    relationships
      .getLocalRowIds('qualis_competitors', selectedCompetitor.id)
      .map((id) => tallies[id])
</script>

<Grid padding>
  <Row>
    <Column>
      <h1 class="uppercase">{$page.data.category} Qualis</h1>
    </Column>
  </Row>
  <Row>
    <Column lg={4}>
      <TileGroup legend="Select a competitor" on:select={selectCompetitor}>
        {#each listTable(competitors) as competitor}
          <RadioTile value={competitor}>
            {competitor.bib}: {competitor.name}
          </RadioTile>
        {/each}
      </TileGroup>
    </Column>
    {#if selectedCompetitor}
      <Column lg={4}>
        <h2>
          {selectedCompetitor.bib}: {selectedCompetitor.name} ({competitorTallies.filter(
            (tally) => tally.top
          ).length}/5)
        </h2>
        <br />
        <TileGroup legend="Select a problem" on:select={selectProblem} selected={selectedProblem}>
          {#each problems as problem}
            <RadioTile value={problem} light={tops[problem]}>{problem}</RadioTile>
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
    <a href={`/${$page.params.category}/results`}>
      <Button>Results &rarr;</Button>
    </a>
  </div>
</div>
