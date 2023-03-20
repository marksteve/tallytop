<script lang="ts">
  import { page } from '$app/stores'
  const { params } = $page.data
</script>

{#each $page.data.categories as [path, name]}
  <a class="text-4xl font-bold text-white" href="/judge/{params.round}/{path}">
    {name}
  </a>
{/each}
