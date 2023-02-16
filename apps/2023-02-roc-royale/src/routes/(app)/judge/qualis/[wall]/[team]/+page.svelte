<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageData } from './$types'

  const colorClass: Record<string, string> = {
    red: 'text-red-500',
    green: 'text-green-500',
    blue: 'text-blue-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500'
  }

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
      <div class={colorClass[problem.color ?? '']}>{problem.description}</div>
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
