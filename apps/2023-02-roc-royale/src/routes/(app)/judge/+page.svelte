<script lang="ts">
  import { page } from '$app/stores'
</script>

{#each $page.data.rounds as [path, name]}
  <a href="/judge/{path}">{name}</a>
{/each}
