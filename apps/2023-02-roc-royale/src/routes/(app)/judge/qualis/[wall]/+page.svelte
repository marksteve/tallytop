<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

<div class="text-4xl"><a href="/judge/qualis">Qualis</a> / {data.wall}</div>
{#each data.teams as team}
  <a href="/judge/qualis/{data.wall}/{team.id}" class="text-3xl">{team.name}</a>
{/each}
