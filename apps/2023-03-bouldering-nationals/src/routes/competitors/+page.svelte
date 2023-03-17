<script lang="ts">
  import { QrCamera, Button } from '@tallytop/ui'
  import type { PageData } from './$types'

  export let data: PageData

  let competitor: (typeof data.competitors)[string] | null = null

  const handleScan = (id: string) => {
    competitor = data.competitors[id]
  }
</script>

<div class="flex h-screen flex-col items-center justify-center gap-10">
  {#if competitor}
    <div class="text-6xl">
      <div>{competitor.first_name ?? ''}</div>
      <div>{competitor.last_name ?? ''}</div>
    </div>
    <Button
      on:click={() => {
        competitor = null
      }}
    >
      Scan another
    </Button>
  {:else}
    <QrCamera onScan={handleScan} />
  {/if}
</div>
