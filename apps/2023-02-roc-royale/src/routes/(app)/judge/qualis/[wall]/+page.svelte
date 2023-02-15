<script lang="ts">
  import { page } from '$app/stores'
</script>

{#each $page.data.teams as team}
  <a href="/judge/qualis/{$page.params.wall}/{team.id}">{team.name}</a>
{/each}
