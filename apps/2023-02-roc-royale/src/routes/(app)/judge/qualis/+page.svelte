<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

{#each data.walls as wall}
  <a href="/judge/qualis/{wall}">{wall}</a>
{/each}
