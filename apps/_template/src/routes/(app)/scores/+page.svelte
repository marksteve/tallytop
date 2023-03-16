<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

<div class="flex flex-1 flex-col items-center justify-center gap-10 text-6xl">
  {#each data.rounds as [path, name]}
    <a href="/scores/{path}">{name}</a>
  {/each}
</div>
