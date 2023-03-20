<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
  const { params } = data
</script>

{#each data.problems as problem}
  <a
    class="text-4xl font-bold text-white"
    href="/judge/{params.round}/{params.category}/{problem.id}"
  >
    {problem.wall}
  </a>
{/each}
