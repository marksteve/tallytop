<script lang="ts">
  import { page } from '$app/stores'
  import { synced } from '$lib/stores'
  import { listTable, stores } from '$lib/tinybase'
  import { Column, Grid, RadioTile, Row, TileGroup } from 'carbon-components-svelte'
  import { onDestroy, onMount } from 'svelte'
  import Tally from './tally.svelte'

  const { store, relationships } = $stores[$page.params.category]

  export let data: import('./$types').PageData

  const problems = data.walls[$page.params.wall].map(String)

  let competitors = {}
  let tallies = {}
  let competitorTallies: any = []

  $: if ($synced) {
    competitors = store.getTable('competitors')
    tallies = store.getTable('qualis_tally')
    competitorTallies = []
  }

  let listeners: string[]
  onMount(() => {
    listeners = [
      store.addTableListener('competitors', () => {
        competitors = store.getTable('competitors')
      }),
      store.addTableListener('qualis_tally', () => {
        tallies = store.getTable('qualis_tally')
        competitorTallies = getTallies()
      }),
    ]
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
        <div class="sticky top-10">
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
        </div>
      </Column>
    {/if}
    {#if selectedProblem}
      <Column>
        <Tally {store} competitor={selectedCompetitor} problem={selectedProblem} />
      </Column>
    {/if}
  </Row>
</Grid>
