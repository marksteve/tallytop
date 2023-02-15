<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

{#each data.teams as team}
  <a href="/judge/qualis/{data.wall}/{team.id}">{team.name}</a>
{/each}
