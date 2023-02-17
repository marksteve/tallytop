<script lang="ts">
  import type { PageData } from './$types'
  export let data: PageData
</script>

<div class="flex flex-1 flex-col text-white">
  {#each data.scores as { name, score, flashes }}
    <div class="border-roc-hotpink bg-roc-black flex items-center justify-between border-b px-5">
      <div class="font-title w-3/5 py-2 text-4xl leading-none">{name}</div>
      <div class="w-1/5 text-2xl font-black">
        {score}
        <div class="text-roc-yellow text-xl"><span class="font-title">/</span> {flashes}</div>
      </div>
    </div>
  {/each}
</div>
