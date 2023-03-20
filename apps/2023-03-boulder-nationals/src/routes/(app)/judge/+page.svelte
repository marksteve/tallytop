<script lang="ts">
  import Button from '$lib/ui/Button.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

{#each data.rounds as [path, name]}
  <a href="/judge/{path}"><Button class="text-6xl">{name}</Button></a>
{/each}
