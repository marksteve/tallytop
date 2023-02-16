<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

<div class="text-4xl"><a href="/judge/finals">Finals</a> / {data.problem?.wall}</div>
{#each data.teams as team}
  <a href="/judge/finals/{data.problem?.id}/{team.id}" class="text-3xl">{team.name}</a>
{/each}
