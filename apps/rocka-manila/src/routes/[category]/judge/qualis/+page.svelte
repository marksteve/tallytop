<script lang="ts">
  import { page } from '$app/stores'
  import { Button, Column, Grid, RadioTile, Row, Tile, TileGroup } from 'carbon-components-svelte'

  let selectedCompetitor: string
  let selectedProblem: string

  let competitors = Array(30)
    .fill(null)
    .map((_, i) => ({ bib: String(i + 100) }))
  let problems = Array(15)
    .fill(null)
    .map((_, i) => ({ score: String(i + 1) }))
  let attempts = 0
  let top = false

  const selectCompetitor = (e: any) => {
    selectedCompetitor = e.detail
  }

  const selectProblem = (e: any) => {
    selectedProblem = e.detail
  }

  const incAttempts = () => {
    attempts = attempts + 1
  }

  const decAttempts = () => {
    attempts = Math.max(0, attempts - 1)
  }

  const toggleTop = () => {
    top = !top
  }
</script>

<Grid padding>
  <Row>
    <Column lg={4}>
      <h1 class="uppercase">{$page.params.category} Qualis</h1>
      <br />
      <TileGroup legend="Competitor" on:select={selectCompetitor}>
        {#each competitors as competitor}
          <RadioTile value={competitor.bib}>
            {competitor.bib}
          </RadioTile>
        {/each}
      </TileGroup>
    </Column>
    {#if selectedCompetitor}
      <Column lg={4}>
        <h2>{selectedCompetitor}</h2>
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
        <div class="flex flex-col gap-5 items-center min-h-screen justify-center sticky top-0">
          <h2>{selectedCompetitor} on {selectedProblem}</h2>
          Attempts
          <Tile><div class="text-9xl p-5">{attempts}</div></Tile>
          <div class="grid grid-cols-2 gap-5">
            <Button kind="secondary" on:click={decAttempts}>-</Button>
            <Button kind="secondary" on:click={incAttempts}>+</Button>
            {#if attempts > 0}
              <Button kind={top ? 'primary' : 'tertiary'} on:click={toggleTop} class="col-span-2"
                >Top</Button
              >
            {/if}
          </div>
        </div>
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
