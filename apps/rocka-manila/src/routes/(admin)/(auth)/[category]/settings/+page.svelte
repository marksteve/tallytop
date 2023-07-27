<script lang="ts">
  import { page } from '$app/stores'
  import { listTable, stores } from '$lib/tinybase'
  import { Column, Grid, DataTable, Row, TextArea } from 'carbon-components-svelte'
  import { onDestroy, onMount } from 'svelte'

  const { store } = $stores[$page.params.category]

  let competitors = store.getTable('competitors')
  $: competitorsText = Object.entries(competitors)
    .map(([bib, competitor]) => `${bib}: ${competitor.name}`)
    .join('\n')

  let listeners: string[]
  onMount(() => {
    listeners = [
      store.addTableListener('competitors', () => {
        competitors = store.getTable('competitors')
      }),
    ]
  })
  onDestroy(() => {
    listeners.forEach((listenerId) => store.delListener(listenerId))
  })

  const setCompetitors = (e: any) => {
    const competitors = Object.fromEntries(
      e.target.value.split('\n').map((line: string) => {
        const [bib, name] = line.split(':').map((s) => s.trim())
        return [bib, { bib: Number(bib), name: name ?? bib }]
      })
    )
    store.setTable('competitors', competitors)
  }
</script>

<Grid padding>
  <Row>
    <Column><h1 class="uppercase">{$page.data.category} Settings</h1></Column>
  </Row>
  <Row>
    <Column>
      <TextArea
        labelText="Input competitors (Format - bib_number: competitor_name)"
        placeholder="101: Spongebob Squarepants"
        on:change={setCompetitors}
        value={competitorsText}
        rows={20}
      />
    </Column>
    <Column>
      <DataTable
        headers={[
          { key: 'bib', value: 'Bib' },
          { key: 'name', value: 'Name' },
        ]}
        rows={listTable(competitors)}
      />
    </Column>
  </Row>
</Grid>
