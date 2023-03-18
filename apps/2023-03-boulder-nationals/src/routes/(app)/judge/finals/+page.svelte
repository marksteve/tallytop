<script lang="ts">
  import colors from '$lib/colors'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<div class="flex w-full flex-col text-center leading-loose">
  {#each data.problems as problem}
    <a href="/judge/finals/{problem.id}" class="border-b {colors[problem.color ?? '']}">
      {problem.wall}
    </a>
  {/each}
</div>
