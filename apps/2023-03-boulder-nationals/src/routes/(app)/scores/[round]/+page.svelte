<script lang="ts">
  import { page } from '$app/stores'
  const { params } = $page
</script>

{#each $page.data.categories as [path, name]}
  <a class="text-4xl font-bold text-white" href="/scores/{params.round}/{path}">
    {name}
  </a>
{/each}
