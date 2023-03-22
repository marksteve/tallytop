<script lang="ts">
  import { page } from '$app/stores'
</script>

{#each $page.data.rounds as [path, name]}
  <a class="text-6xl font-bold text-white" href="/scores/{path}">
    {name}
  </a>
{/each}
