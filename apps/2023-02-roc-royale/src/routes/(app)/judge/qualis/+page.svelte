<script lang="ts">
  import { page } from '$app/stores'
</script>

{#each $page.data.walls as wall}
  <a href="/judge/qualis/{wall}">{wall}</a>
{/each}
