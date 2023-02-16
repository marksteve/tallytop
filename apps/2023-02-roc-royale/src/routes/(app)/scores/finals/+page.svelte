<script lang="ts">
  import type { PageData } from './$types'
  export let data: PageData
</script>

<div class="p-5">
  <table class="w-full">
    <thead class="font-title bg-roc-yellow text-xl">
      <tr>
        <th colspan="2" class="text-left">Team</th>
        <th class="w-1/12">T</th>
        <th class="w-1/12">Z</th>
        <th class="w-1/12">TA</th>
        <th class="w-1/12">ZA</th>
      </tr>
    </thead>
    <tbody class="bg-roc-black text-2xl text-white">
      {#each data.scores as { name, walls, tops, zones, top_attempts, zone_attempts }}
        <tr class="border-roc-hotpink border-b">
          <td class="font-title text-4xl">{name}</td>
          <td class="text-roc-yellow align-middle">
            <div class="flex gap-1 px-5">
              {#each walls ?? [] as wall}
                {#if wall == 'zone'}
                  <div class="flex h-4 w-2 flex-col justify-end border border-current">
                    <div class="h-1/2 bg-current" />
                  </div>
                {:else if wall == 'top'}
                  <div class="h-4 w-2 bg-current" />
                {:else}
                  <div class="h-4 w-2 border border-current" />
                {/if}
              {/each}
            </div>
          </td>
          <td class="text-center font-black">{tops}</td>
          <td class="text-center font-black">{zones}</td>
          <td class="text-center font-black">{top_attempts}</td>
          <td class="text-center font-black">{zone_attempts}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
