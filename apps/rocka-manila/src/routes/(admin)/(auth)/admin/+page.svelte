<script lang="ts">
  import { Grid, Row, Column, ClickableTile } from 'carbon-components-svelte'
  import { categories } from '$lib/constants'
</script>

<Grid padding>
  <Row>
    {#each Object.entries(categories) as [category, label]}
      <Column>
        <h2 class="uppercase">{label}</h2>
        <br />
        <ClickableTile href={`/${category}/settings`}>Settings</ClickableTile>
        {#each ['qualis', 'finals'] as round}
          <ClickableTile href={`/${category}/judge/${round}`}>Judge {round}</ClickableTile>
        {/each}
      </Column>
    {/each}
  </Row>
</Grid>
