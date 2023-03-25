<script lang="ts">
  import { page } from '$app/stores'
  import { categories, rounds } from '$lib/labels'
  import type { PageData } from './$types'

  export let data: PageData
  $: params = $page.params
  $: cutoff = data.cutoffs[params.round]?.[params.category] ?? 0
</script>

<div class="prose-lg prose flex max-w-full flex-col items-center p-10">
  <div class="flex items-center justify-between self-stretch">
    <img class="m-0 h-20" src="/images/logo.svg" />
    <div class="text-center">
      <h2 class="m-0">{categories[params.category]} {rounds[params.round]}</h2>
      <div>Official Results</div>
    </div>
    <div class="text-sm">
      <div>The Bouldering Hive</div>
      <div>Circuit Makati</div>
      <div>March 25 to 26</div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th />
        <th>Name</th>
        <th>Bib</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {#each data.scores as score, index}
        <tr
          class="border-0 border-black"
          class:border-b={index === cutoff - 1}
          class:font-bold={index < cutoff}
        >
          <td>{index + 1}</td>
          <td>{score.competitor_first_name} {score.competitor_last_name}</td>
          <td>{score.competitor_bib_number}</td>
          <td>
            {score.tops}T
            {score.zones}z
            {score.top_attempts}
            {score.zone_attempts}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
