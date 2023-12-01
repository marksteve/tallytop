<script lang="ts">
  import {
    listCompetitorsByCategory,
    listCompetitorsWithScores,
    type CompetitorWithScores,
  } from '$reflect/competitor'
  import type { M } from '$reflect/mutators'
  import { listPromotedCompetitors, type Score } from '$reflect/score'
  import type { Reflect } from '@rocicorp/reflect/client'
  import confetti from 'canvas-confetti'

  export let r: Reflect<M>
  export let category: 'open-m' | 'open-w'
  export let round: string

  $: problems = [
    ...Array(
      {
        qualis: 5,
        finals: 4,
      }[round],
    ).keys(),
  ].map((i) => `${category.slice(-1).toUpperCase()}${i + 1}`)

  $: attemptsPrefix = [category, round]

  let competitors: CompetitorWithScores[] = []

  let unsubscribe: () => void
  $: {
    unsubscribe && unsubscribe()
    unsubscribe = r.subscribe(
      async (tx) => {
        const competitors =
          round === 'qualis'
            ? await listCompetitorsByCategory(tx, category)
            : await listPromotedCompetitors(tx, [category, round])
        return await listCompetitorsWithScores(tx, {
          competitors,
          attemptsPrefix,
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
  }

  const getImage = (score: Score) => {
    switch (true) {
      case score?.ta > 0:
        return '/images/whole-with-bolt.png'
      case score?.za > 0:
        return '/images/three-quarters-with-bolts.png'
      default:
        return '/images/half-with-bolts.png'
    }
  }

  let competitorNodes: Record<string, HTMLElement> = {}
  let competitorSubscriptions: Record<string, () => void> = {}
  $: if (competitors.length > 0) {
    for (const competitor of competitors) {
      if (competitorNodes[competitor.id]) continue
      competitorSubscriptions[competitor.id] = r.subscribe(
        (tx) => tx.get(['cheers', round, competitor.id].join('/')),
        (data) => {
          const { left, top, width, height } =
            competitorNodes[competitor.id].getBoundingClientRect()
          const x = (left + 50) / window.innerWidth
          const y = (top + height / 2) / window.innerHeight
          confetti({
            particleCount: 5,
            startVelocity: 10,
            spread: 180,
            origin: { x, y },
            colors: ['#e8aa3e', '#07ae71', '#ca3f43'],
          })
        },
      )
    }
  }
</script>

<div
  class="bg-brand-peach border-brand-red grid grid-cols-3 items-center gap-x-10 gap-y-5 rounded-xl border p-5"
>
  <div class="contents text-xs">
    <div />
    <div class="flex items-center justify-around">
      {#each problems as problem, i}
        <div>{problem}</div>
      {/each}
    </div>
    <div class="grid grid-cols-4 justify-around">
      <div>T</div>
      <div>Z</div>
      <div>TA</div>
      <div>ZA</div>
    </div>
  </div>
  {#each competitors as competitor}
    <div
      class="col-start-1 text-left text-xl"
      bind:this={competitorNodes[competitor.id]}
    >
      #{competitor.number}
      {competitor.name}
    </div>
    <div class="flex items-center justify-around">
      {#each problems as problem, i}
        <div class="text-center">
          {#if competitor.scores?.[i + 1]}
            <img
              src={getImage(competitor.scores[i + 1])}
              alt={problem}
              class="h-8"
            />
          {/if}
        </div>
      {/each}
    </div>
    {#if competitor.scores?.total}
      <div class="grid grid-cols-4 justify-around">
        <div class="text-brand-red text-xl">{competitor.scores.total.t}</div>
        <div class="text-brand-red text-xl">{competitor.scores.total.z}</div>
        <div class="text-brand-red text-xl">
          {competitor.scores.total.ta}
        </div>
        <div class="text-brand-red text-xl">
          {competitor.scores.total.za}
        </div>
      </div>
    {/if}
  {/each}
</div>
