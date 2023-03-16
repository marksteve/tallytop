<script lang="ts">
  import { QrDisplay } from '@tallytop/ui'
  import type { PageData } from './$types'

  export let data: PageData

  const categories: Record<string, string> = {
    open_m: `Open Men's`,
    open_w: `Open Women's`,
    inter_m: `Inter Men's`,
    inter_w: `Inter Women's`,
    unknown: 'Unknown'
  }
</script>

<div class="p-5">
  <div class="grid grid-cols-4 gap-1">
    {#each data.competitors as competitor}
      <div class="flex items-center border">
        <div class="flex flex-1 flex-col gap-2 p-5">
          <div class="text-xl">
            <div>{competitor.first_name}</div>
            <div>{competitor.last_name}</div>
          </div>
          <div class="border-b" />
          <div>{categories[competitor.category ?? '']}</div>
        </div>
        <div class="w-1/3 p-3">
          <QrDisplay data={competitor.id} />
        </div>
      </div>
    {/each}
  </div>
</div>
