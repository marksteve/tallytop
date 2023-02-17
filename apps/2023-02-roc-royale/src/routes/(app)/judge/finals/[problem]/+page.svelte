<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

<div class="px-5 text-4xl"><a href="/judge/finals">Finals</a> / {data.problem?.wall}</div>
<div class="bg-roc-black flex w-full flex-col text-white">
  {#each data.teams as team}
    <a
      href="/judge/finals/{data.problem?.id}/{team.id}"
      class="border-roc-hotpink border-b py-2 px-5 text-3xl"
    >
      {team.name}
    </a>
  {/each}
</div>
