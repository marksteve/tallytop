<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import {
    listCompetitorsByCategory,
    listCompetitorsWithScores,
    type CompetitorWithScores,
  } from '$reflect/competitor'
  import { listPromotedCompetitors } from '$reflect/score'
  import { Button, variants } from '@tallytop/ui'

  const { r } = $page.data

  const category = `open-${$page.params.category}`
  const round = $page.params.round

  const nextRound = {
    qualis: 'finals',
    finals: 'winners',
  }[round]

  let competitors: CompetitorWithScores[] = []

  r.subscribe(
    async (tx) => {
      const competitors =
        round === 'qualis'
          ? await listCompetitorsByCategory(tx, category)
          : await listPromotedCompetitors(tx, [category, round])
      return await listCompetitorsWithScores(tx, {
        competitors,
        attemptsPrefix: [category, round],
      })
    },
    (data) => {
      competitors = data.toSorted((a, b) => {
        if (!a.scores?.total || !b.scores?.total) return 0
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

  let selected: string[] = []

  const handleSelect = (competitor: CompetitorWithScores) => {
    if (selected.includes(competitor.id)) {
      selected = selected.filter((c) => c !== competitor.id)
    } else {
      selected = [...selected, competitor.id]
    }
  }

  const promote = async () => {
    if (selected.length < 1) {
      return
    }
    await r.mutate.promoteCompetitors({
      key: [category, nextRound],
      value: selected,
    })
    goto(`/admin/judge/${category}/${nextRound}`)
  }
</script>

<div class={variants.list()}>
  {#each competitors as competitor}
    <button
      class={variants.listItem({
        class: 'flex flex-wrap content-center gap-2 text-3xl',
        selected: selected.includes(competitor.id),
      })}
      on:click={() => handleSelect(competitor)}
    >
      <span class="text-slate-400">#{competitor.number}</span>
      {competitor.name}
      <span class="w-full text-base">
        {#if competitor.scores.total}
          t{competitor.scores.total.t}
          z{competitor.scores.total.z}
          ta{competitor.scores.total.ta}
          za{competitor.scores.total.za}
        {/if}
      </span>
    </button>
  {/each}
  <div class="flex p-2">
    <Button
      class="h-10 flex-1"
      variant="primary"
      disabled={selected.length < 1}
      on:click={promote}
    >
      promote {selected.length} competitors to {nextRound}
    </Button>
  </div>
</div>
