<script lang="ts">
  import { page } from '$app/stores'
</script>

{#each $page.data.problems as problem}
  <a
    class="text-4xl font-bold text-white"
    href="/judge/{$page.params.round}/{$page.params.category}/{problem.id}"
  >
    {problem.wall}
  </a>
{/each}
