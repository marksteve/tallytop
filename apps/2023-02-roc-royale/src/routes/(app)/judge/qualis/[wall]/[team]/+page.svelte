<script lang="ts">
  import { enhance } from '$app/forms'
  import { page } from '$app/stores'
</script>

<div class="text-4xl">
  <a href="./">{$page.params.wall}</a>
  / {$page.data.team.name}
</div>

<div class="flex w-full flex-col text-3xl">
  {#each $page.data.problems as problem}
    <div class="bg-roc-black flex justify-between gap-5 px-5 leading-loose text-white">
      {problem.description}
      <form class="flex w-1/2 justify-around" method="POST" use:enhance>
        <input type="hidden" name="problem" value={problem.id} />
        <button formaction="?/flash">/ Flash</button>
        <button formaction="?/top">Top</button>
      </form>
    </div>
  {/each}
</div>
