<script lang="ts">
  import { page } from '$app/stores'
  import { categories, rounds } from '$lib/labels'
  import failIcon from '$lib/ui/icons/fail.svg'
  import topIcon from '$lib/ui/icons/top.svg'
  import zoneIcon from '$lib/ui/icons/zone.svg'
  import type { PageData } from './$types'

  export let data: PageData
  $: params = $page.params
</script>

{#if data.scores.length === 0}
  <div class="p-10 text-3xl text-white">
    <strong>{rounds[params.round]}</strong> round for the
    <strong>{categories[params.category]}</strong> category hasn't started yet. Please check back later.
  </div>
{:else}
  <div
    class="grid grid-cols-4 items-center justify-items-center gap-2 self-start justify-self-stretch p-5 text-white md:grid-cols-8"
  >
    <div class="md:contents hidden">
      <strong class="col-span-4 justify-self-start">ATHLETE</strong>
      <strong>TOPS</strong>
      <strong>ZONES</strong>
      <strong>TOP ATTEMPTS</strong>
      <strong>ZONE ATTEMPTS</strong>
    </div>
    {#each data.scores as score}
      <div
        class="col-span-3 flex items-center gap-2 justify-self-stretch text-xl font-bold uppercase"
      >
        <div class="text-brand w-10 rounded-full bg-white text-center text-sm font-bold">
          {score.bib_number}
        </div>
        {score.first_name}
        {score.last_name}
      </div>
      <div class="flex gap-1">
        {#each score.walls ?? [] as wall}
          {#if wall === 'top'}
            <img src={topIcon} class="h-6" />
          {:else if wall === 'zone'}
            <img src={zoneIcon} class="h-6" />
          {:else}
            <img src={failIcon} class="h-6" />
          {/if}
        {/each}
      </div>
      <div>
        T <span class="font-bold">{score.tops}</span>
      </div>
      <div>
        Z <span class="font-bold">{score.zones}</span>
      </div>
      <div>
        TA <span class="font-bold">{score.top_attempts}</span>
      </div>
      <div>
        ZA <span class="font-bold">{score.zone_attempts}</span>
      </div>
    {/each}
  </div>
{/if}
