<script lang="ts">
  import { enhance } from '$app/forms'
  import { invalidate } from '$app/navigation'
  import { page } from '$app/stores'
  import { categories, rounds } from '$lib/labels'
  import Button from '$lib/ui/Button.svelte'
  import failIcon from '$lib/ui/icons/fail.svg'
  import topIcon from '$lib/ui/icons/top.svg'
  import zoneIcon from '$lib/ui/icons/zone.svg'
  import type { RealtimeChannel } from '@supabase/supabase-js'
  import { onDestroy, onMount } from 'svelte'
  import type { PageData } from './$types'

  export let data: PageData
  $: params = $page.params

  const cutoff = {
    qualis: {
      inter_m: 6,
      inter_w: 6,
      open_m: 20,
      open_w: 6
    },
    semis: {
      open_m: 6
    },
    finals: {
      inter_m: 3,
      inter_w: 3,
      open_m: 3,
      open_w: 3
    }
  }

  let channel: RealtimeChannel

  onMount(() => {
    channel = data.supabaseClient
      .channel('any')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'climbs'
        },
        (payload) => {
          invalidate([params.round, params.category].join(':'))
        }
      )
      .subscribe()
  })

  onDestroy(() => {
    if (channel) {
      data.supabaseClient.removeChannel(channel)
    }
  })

  $: defaultValue = cutoff[params.round]?.[params.category] ?? 0
  $: ifscFormat = !(params.round === 'qualis' && params.category.startsWith('inter_'))
  $: numWalls = params.round === 'qualis' && ifscFormat ? 5 : 4
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
    <div class="hidden md:contents">
      <strong class="col-span-4 justify-self-start">ATHLETE</strong>
      <strong>TOPS</strong>
      <strong>ZONES</strong>
      <strong>TOP ATTEMPTS</strong>
      <strong>ZONE ATTEMPTS</strong>
    </div>
    {#each data.scores as score, index}
      <div
        class={'col-span-3 flex items-center gap-2 justify-self-stretch text-xl font-bold uppercase'}
      >
        <div class="text-brand w-10 rounded-full bg-white text-center text-sm font-bold">
          {score.competitor_bib_number}
        </div>
        <div class={index < defaultValue ? 'bg-white/20' : ''}>
          {score.competitor_first_name}
          {score.competitor_last_name}
        </div>
      </div>
      <div class="flex gap-1">
        {#if ifscFormat}
          {#each (score.walls ?? []).slice(0, numWalls) as wall}
            {#if wall === 'top'}
              <img src={topIcon} class="h-6" />
            {:else if wall === 'zone'}
              <img src={zoneIcon} class="h-6" />
            {:else}
              <img src={failIcon} class="h-6" />
            {/if}
          {/each}
        {/if}
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
    {#if data.nextRound && !data.nextHasStartlist && data.scores.length > 0 && data.session}
      <form class="col-span-4 p-5 text-black md:col-span-8" method="POST" use:enhance>
        <div class="flex flex-col items-center gap-2 rounded-xl bg-white p-5 md:flex-row">
          Advance top
          <input
            class="w-16 rounded-xl border-4 text-center text-3xl"
            type="number"
            name="cutoff"
            value={defaultValue}
          />
          to {rounds[data.nextRound]}
          <Button class="p-1 text-sm" type="submit">CONFIRM</Button>
        </div>
      </form>
    {/if}
  </div>
{/if}
