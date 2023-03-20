<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

{#each data.rounds as [path, name]}
  <a class="text-6xl font-bold text-white" href="/judge/{path}">
    {name}
  </a>
{/each}
