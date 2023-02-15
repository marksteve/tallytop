<script lang="ts">
  import { page } from '$app/stores'
</script>

{#each $page.data.teams as team}
  <a href="/judge/qualis/{team.id}">{team.name}</a>
{/each}
