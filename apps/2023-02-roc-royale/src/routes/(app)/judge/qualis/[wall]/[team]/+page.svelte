<script lang="ts">
  import { enhance } from '$app/forms'
  import colors from '$lib/colors'
  import type { PageData } from './$types'

  export let data: PageData

  let attempted: Record<string, boolean> = {}

  $: results = data.results
</script>

<div class="px-5 text-4xl">
  <a href="/judge/qualis/{data.wall}">{data.wall}</a>
  /<br />{data.team?.name}
</div>

<div class="bg-roc-black flex w-full flex-col text-3xl leading-relaxed text-white">
  {#each data.problems as problem}
    <div class="border-roc-hotpink flex justify-between gap-5 border-b px-5">
      <div class={colors[problem.color ?? '']}>{problem.description}</div>
      <form class="flex w-1/2 justify-around text-2xl" method="POST" use:enhance>
        <input type="hidden" name="problem" value={problem.id} />
        <button
          class:text-roc-yellow={results[problem.id]?.is_flash}
          formaction={results[problem.id]?.is_flash ? '?/clear' : '?/flash'}
        >
          / Flash
        </button>
        <button
          class:text-roc-yellow={results[problem.id]?.is_top}
          formaction={results[problem.id]?.is_top ? '?/clear' : '?/top'}
        >
          Top
        </button>
        <button
          class:text-roc-yellow={attempted[problem.id] && !results[problem.id]}
          on:click|preventDefault={() => (attempted[problem.id] = !attempted[problem.id])}>X</button
        >
      </form>
    </div>
  {/each}
</div>
