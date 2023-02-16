<script lang="ts">
  import { enhance } from '$app/forms'
  import colors from '$lib/colors'
  import type { PageData } from './$types'

  export let data: PageData

  $: results = data.results
</script>

<div class="text-4xl">
  <a href="/judge/qualis/{data.wall}">{data.wall}</a>
  / {data.team?.name}
</div>

<div class="bg-roc-black flex w-full flex-col text-3xl leading-loose text-white">
  {#each data.problems as problem}
    <div class="border-roc-hotpink flex justify-between gap-5 border-b px-5">
      <div class={colors[problem.color ?? '']}>{problem.description}</div>
      <form class="flex w-1/2 justify-around" method="POST" use:enhance>
        <input type="hidden" name="problem" value={problem.id} />
        <button class:text-roc-yellow={results[problem.id]?.is_flash} formaction="?/flash">
          / Flash
        </button>
        <button class:text-roc-yellow={results[problem.id]?.is_top} formaction="?/top">Top</button>
      </form>
    </div>
  {/each}
</div>
