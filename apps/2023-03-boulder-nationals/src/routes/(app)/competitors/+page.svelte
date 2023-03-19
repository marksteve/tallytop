<script lang="ts">
  import * as labels from '$lib/labels'
  import Button from '$lib/ui/Button.svelte'
  import { QrCamera } from '@tallytop/ui'
  import * as R from 'ramda'
  import type { PageData } from './$types'

  export let data: PageData

  let scanMode = false
  let selected: (typeof data.competitors)[string] | null = null
  const byCategory = R.groupBy(R.prop('category'), R.values(data.competitors))

  const handleScan = (event: any) => {
    selected = data.competitors[event.detail]
    scanMode = false
  }
</script>

<div class="text-brand flex min-h-screen flex-col justify-center gap-10 pb-20">
  {#if selected}
    <div class="flex flex-col gap-5 p-10">
      <div class="text-6xl">
        {selected.first_name ?? ''}
        {selected.last_name ?? ''}
      </div>
      <Button
        on:click={() => {
          selected = null
        }}
      >
        BACK
      </Button>
    </div>
  {:else if scanMode}
    <div class="flex flex-col gap-5 p-10">
      <QrCamera on:scan={handleScan} />
      <div class="text-center text-xl">Scan a competitor's QR code</div>
      <Button on:click={() => (scanMode = false)}>CANCEL</Button>
    </div>
  {:else}
    <div class="flex flex-col uppercase">
      {#each R.toPairs(byCategory) as [category, competitors]}
        <h3 class="bg-brand sticky top-0 p-5 text-xl font-bold text-white">
          {labels.categories[category]}
        </h3>
        {#each competitors as competitor}
          <button class="p-5 text-left uppercase" on:click={() => (selected = competitor)}>
            {competitor.first_name ?? ''}
            {competitor.last_name ?? ''}
          </button>
        {/each}
      {/each}
    </div>
    <div class="fixed inset-x-0 bottom-0 flex p-5">
      <Button class="flex-1" on:click={() => (scanMode = true)}>SCAN</Button>
    </div>
  {/if}
</div>
