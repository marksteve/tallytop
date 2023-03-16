<script lang="ts">
  import Lightning from 'phosphor-svelte/lib/Lightning'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<div class="p-5">
  <table class="w-full">
    <thead class="font-title text-xl">
      <tr>
        <th colspan="2" class="text-left">Team</th>
        <th class="w-1/12">T</th>
        <th class="w-1/12">Z</th>
        <th class="w-1/12">TA</th>
        <th class="w-1/12">ZA</th>
      </tr>
    </thead>
    <tbody class="text-2xl text-white">
      {#each data.scores as { name, walls, tops, zones, top_attempts, zone_attempts }}
        <tr class="border-b">
          <td class="font-title text-4xl">{name}</td>
          <td class="align-middle">
            <div class="flex px-5">
              {#each walls ?? [] as wall}
                {#if wall == 'zone'}
                  <Lightning weight="duotone" />
                {:else if wall == 'top'}
                  <Lightning weight="fill" />
                {:else}
                  <Lightning weight="thin" />
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
