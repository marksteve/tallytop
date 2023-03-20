<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
  const { params } = data
</script>

{#each data.problems as [path, name]}
  <a class="text-4xl font-bold text-white" href="/judge/{params.round}/{params.category}/{path}">
    {name}
  </a>
{/each}
