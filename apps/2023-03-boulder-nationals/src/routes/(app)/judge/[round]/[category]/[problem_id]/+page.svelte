<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/ui/Button.svelte'
  import { QrCamera } from '@tallytop/ui'

  const { params } = $page.data

  let scanMode = false

  const handleScan = (event: any) => {
    goto(`/judge/${params.round}/${params.category}/${params.problem_id}/${event.detail}`)
    scanMode = false
  }
</script>

{#if scanMode}
  <div class="flex flex-col gap-5 p-10 text-white">
    <QrCamera on:scan={handleScan} />
    <div class="text-center text-xl">Scan a competitor's QR code</div>
    <Button on:click={() => (scanMode = false)}>CANCEL</Button>
  </div>
{:else}
  {#each $page.data.competitors as competitor}
    <a
      class="flex items-center gap-2 justify-self-stretch p-5 font-bold uppercase text-white"
      href="/judge/{params.round}/{params.category}/{params.problem_id}/{competitor.id}"
    >
      <div class="text-brand w-10 rounded-full bg-white text-center text-sm">
        {competitor.bib_number}
      </div>
      {competitor.first_name}
      {competitor.last_name}
    </a>
  {/each}
  <div class="fixed right-0 bottom-0 flex p-5">
    <Button class="flex-1" on:click={() => (scanMode = true)}>SCAN QR</Button>
  </div>
{/if}
