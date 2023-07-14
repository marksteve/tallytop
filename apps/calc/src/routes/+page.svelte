<script lang="ts">
  import {
    Button,
    Column,
    Content,
    DataTable,
    Form,
    FormGroup,
    Grid,
    Header,
    InlineNotification,
    LocalStorage,
    RadioTile,
    Row,
    SelectableTile,
    Tab,
    TabContent,
    Tabs,
    Tag,
    TextArea,
    Tile,
    TileGroup,
  } from 'carbon-components-svelte'

  let store = JSON.parse(
    localStorage.getItem('tallytop-phoenix') ??
      JSON.stringify({
        competitorsInput: '',
        problemsInput: '',
        scoresInput: '',
        tops: {},
      })
  )
  let storage: LocalStorage
  let step = 0
  let competitorsInput = store.competitorsInput
  let problemsInput = store.problemsInput
  let scoresInput = store.scoresInput
  let currCompetitor: string
  let tops: Record<string, string[]> = store.tops

  const splitLines = (input: string) =>
    input
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  const getTotal = (t: string[]) =>
    t ? t.reduce((score, problem) => parseFloat(scores[problems.indexOf(problem)]) + score, 0) : 0

  $: store = JSON.stringify({
    competitorsInput,
    problemsInput,
    scoresInput,
    tops,
  })
  $: competitors = splitLines(competitorsInput)
  $: problems = splitLines(problemsInput)
  $: scores = splitLines(scoresInput)
  $: validProblems = problems.length > 0 && problems.length === scores.length
  $: currTotal = getTotal(tops[currCompetitor])
  $: results = Object.entries(tops)
    .map(([competitor, competitorTops], i) => ({
      id: i,
      competitor,
      total: getTotal(competitorTops),
      tops: competitorTops?.sort((a, b) => a.localeCompare(b)) ?? [],
    }))
    .sort((a, b) => b.total - a.total)

  const nextStep = () => {
    step += 1
  }
  const nextCompetitor = () => {
    const currIndex = competitors.indexOf(currCompetitor)
    if (currIndex >= competitors.length - 1) {
      nextStep()
    } else {
      currCompetitor = competitors[currIndex + 1]
    }
  }
  const reset = () => {
    storage.clearItem()
    location.reload()
  }
</script>

<LocalStorage key="tallytop-phoenix" bind:value={store} bind:this={storage} />

<Header company="Tallytop" platformName="Calc" />

<Content>
  <h1>Phoenix</h1>
  <Tabs bind:selected={step}>
    <Tab label="Enter competitors" />
    <Tab label="Enter problems" />
    <Tab label="Enter tops" />
    <Tab label="Compute results" />
    <svelte:fragment slot="content">
      <TabContent>
        <Form on:submit={nextStep}>
          <FormGroup>
            <TextArea labelText="Competitors" rows={30} bind:value={competitorsInput} />
          </FormGroup>
          <Button type="submit">Next</Button>
        </Form>
      </TabContent>
      <TabContent>
        <Form on:submit={nextStep}>
          <Grid noGutter>
            <Row>
              <Column>
                <FormGroup>
                  <TextArea labelText="Problems" rows={30} bind:value={problemsInput} />
                </FormGroup>
              </Column>
              <Column>
                <FormGroup>
                  <TextArea labelText="Scores" rows={30} bind:value={scoresInput} />
                </FormGroup>
              </Column>
            </Row>
          </Grid>
          {#if problems.length > 0 && !validProblems}
            <InlineNotification
              kind="warning"
              title="Fix:"
              subtitle="Problems and scores should match"
            />
          {/if}
          <Button type="submit" disabled={!validProblems}>Next</Button>
        </Form>
      </TabContent>
      <TabContent>
        <Grid noGutter>
          <Row>
            <Column sm={1} md={2} lg={4}>
              <TileGroup legend="Competitors" bind:selected={currCompetitor}>
                {#each competitors as competitor}
                  <RadioTile value={competitor}>{competitor}</RadioTile>
                {/each}
              </TileGroup>
            </Column>
            <Column>
              {#if currCompetitor}
                <div class="tops">
                  <h1>{currCompetitor}</h1>
                  <div>
                    {#each problems as problem}
                      <SelectableTile
                        on:select={() => {
                          if (tops[currCompetitor]?.includes(problem)) return
                          const competitorTops = tops[currCompetitor] ?? []
                          tops[currCompetitor] = [...competitorTops, problem]
                        }}
                        on:deselect={() => {
                          tops[currCompetitor] = tops[currCompetitor]?.filter((p) => p !== problem)
                        }}
                        selected={tops[currCompetitor]?.includes(problem)}
                      >
                        {problem}
                      </SelectableTile>
                    {/each}
                  </div>
                </div>
                <Tile light>Total: {currTotal}</Tile>
                <Button on:click={nextCompetitor}>Next</Button>
              {/if}
            </Column>
          </Row>
        </Grid>
      </TabContent>
      <TabContent>
        <DataTable
          title="Results"
          headers={[
            { key: 'competitor', value: 'Competitor' },
            { key: 'total', value: 'Total' },
            { key: 'tops', value: 'Tops' },
          ]}
          rows={results}
        >
          <svelte:fragment slot="cell" let:cell>
            {#if cell.key === 'tops'}
              {#each cell.value as problem}
                <Tag>{problem}</Tag>
              {/each}
            {:else}
              {cell.value}
            {/if}
          </svelte:fragment>
        </DataTable>
        <br /><br />
        <Button kind="danger" on:click={reset}>Reset</Button>
      </TabContent>
    </svelte:fragment>
  </Tabs>
</Content>

<style scoped>
  .tops {
    position: sticky;
    top: calc(47px + 16px);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
