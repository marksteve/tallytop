<script lang="ts">
  import { page } from '$app/stores'
  import { r } from '$lib/reflect'
  import {
    listCompetitorsByCategory,
    type Competitor,
  } from '$reflect/competitor'
  import { listPromotedCompetitors } from '$reflect/score'
  import { variants } from '@tallytop/ui'

  const category = `open-${$page.params.category}`
  const round = $page.params.round

  let competitors: Competitor[] = []

  r.subscribe(
    (tx) => {
      if (round === 'qualis') {
        return listCompetitorsByCategory(tx, category)
      } else {
        return listPromotedCompetitors(tx, [category, round])
      }
    },
    (data) => {
      competitors = round === 'qualis' ? data : data.toReversed()
    },
  )
</script>

<div class={variants.list()}>
  {#each competitors as competitor}
    <a
      href={`./problem:${$page.params.problem}/competitor:${competitor.id}`}
      class={variants.listItem({ class: 'font-tanker flex gap-2 text-3xl' })}
    >
      <span class="text-slate-400">#{competitor.number}</span>
      {competitor.name}
    </a>
  {/each}
</div>
