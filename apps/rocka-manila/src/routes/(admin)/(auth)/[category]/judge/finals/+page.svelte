<script lang="ts">
  import { page } from '$app/stores'
  import { finalsCutoff, qualisProblemsCutoff, qualisScore } from '$lib/rules'
  import { listTable, stores } from '$lib/tinybase'
  import { Column, Grid, RadioTile, Row, TileGroup } from 'carbon-components-svelte'
  import { onDestroy, onMount } from 'svelte'
  import Tally from './tally.svelte'
    import { synced } from '$lib/stores'

  const { store, relationships } = $stores[$page.params.category]

  const problems = $page.data.problems[$page.params.category].map(String)

  let competitors = {}
  let qualisTallies = {}
  $: if ($synced) {
    competitors = store.getTable('competitors')
    qualisTallies = store.getTable('qualis_tally')
  }

  let listeners: string[]
  onMount(() => {
    listeners = [
      store.addTableListener('competitors', () => {
        competitors = store.getTable('competitors')
      }),
      store.addTableListener('qualis_tally', () => {
        qualisTallies = store.getTable('qualis_tally')
      }),
    ]
  })
  onDestroy(() => {
    listeners.forEach((listenerId) => store.delListener(listenerId))
  })

  $: qualisCompetitors = Object.entries(competitors)
    .map(([id, competitor]) => {
      const tallies = getQualisTallies(id)
      return {
        id,
        bib: competitor.bib,
        name: competitor.name,
        score: getQualisScore(tallies),
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, finalsCutoff[$page.params.category])
    .sort((a, b) => a.score - b.score)

  const getQualisTallies = (competitorId) => relationships
    .getLocalRowIds('qualis_competitors', competitorId)
    .map((tallyId) => qualisTallies[tallyId])

  const getQualisScore = (tallies) => {
    return tallies
      ? tallies
        .sort((a, b) => qualisScore(b) - qualisScore(a))
        .slice(0, qualisProblemsCutoff)
        .map((tally) => qualisScore(tally))
        .reduce((a, b) => a + b, 0)
      : 0
  }

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
          {#each listTable(qualisCompetitors) as competitor}
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
