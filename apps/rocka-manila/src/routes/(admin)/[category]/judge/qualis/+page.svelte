<script lang="ts">
  import { page } from '$app/stores'
  import { ClickableTile, Column, Grid, Row  } from "carbon-components-svelte";
</script>

<Grid padding>
  <Row>
    <Column>
      <h1 class="uppercase">{$page.data.category} Qualis</h1>
    </Column>
  </Row>
  <Row>
    <Column lg={4}>
      {#each Object.keys($page.data.walls) as wall}
        <ClickableTile href={`/${$page.params.category}/judge/qualis/${wall}`}>Wall {wall}</ClickableTile>
      {/each}
    </Column>
  </Row>
</Grid>
