<script lang="ts">
  import { page } from '$app/stores'
  import { r } from '$lib/reflect'
  import {
    listCompetitorsByCategory,
    listCompetitorsWithScores,
  } from '$reflect/competitor'
  import { Button, variants } from '@tallytop/ui'

  const numProblems = {
    qualis: 5,
    finals: 4,
  }[$page.params.round]

  const nextRound = {
    qualis: 'finals',
    finals: 'winners',
  }[$page.params.round]

  let competitors: Awaited<ReturnType<typeof listCompetitorsWithScores>> = []

  const prefix = [`open-${$page.params.category}`, $page.params.round]

  r.subscribe(
    async (tx) => {
      const competitors = await listCompetitorsByCategory(
        tx,
        `open-${$page.params.category}`,
      )
      return await listCompetitorsWithScores(tx, {
        competitors,
        attemptsPrefix: prefix,
        numProblems,
      })
    },
    (data) => {
      competitors = data.toSorted((a, b) => {
        const A = a.scores.total
        const B = b.scores.total
        switch (true) {
          case A.t !== B.t:
            return B.t - A.t
          case A.z !== B.z:
            return B.z - A.z
          case A.ta !== B.ta:
            return A.ta - B.ta
          case A.za !== B.za:
            return A.za - B.za
          default:
            return 0
        }
      })
    },
  )

  let selected: typeof competitors = []

  const handleSelect = (competitor) => {
    if (selected.includes(competitor.id)) {
      selected = selected.filter((c) => c !== competitor.id)
    } else {
      selected = [...selected, competitor.id]
    }
  }
</script>

<div class={variants.list({ class: 'font-tanker' })}>
  {#each competitors as competitor}
    <button
      class={variants.listItem({
        class: 'flex gap-2 text-3xl',
        selected: selected.includes(competitor.id),
      })}
      on:click={() => handleSelect(competitor)}
    >
      <span class="text-slate-400">#{competitor.number}</span>
      {competitor.name}
    </button>
  {/each}
  <div class="flex p-2">
    <Button class="h-10 flex-1">
      promote {selected.length} competitors to {nextRound}
    </Button>
  </div>
</div>
