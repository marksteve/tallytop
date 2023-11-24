<script lang="ts">
  import Playground from '$lib/components/playground.svelte'

  import { page } from '$app/stores'
  import { r } from '$lib/reflect'
  import {
    listCompetitorsByCategory,
    listCompetitorsWithScores,
    type Score,
  } from '$reflect/competitor'

  $: category = {
    m: `Open Men's`,
    w: `Open Women's`,
  }[$page.params.category]

  $: round = {
    qualis: 'Qualifiers',
    finals: 'Finals',
  }[$page.params.round]

  $: problems = [
    ...Array(
      {
        qualis: 5,
        finals: 4,
      }[$page.params.round],
    ).keys(),
  ].map((i) => `${$page.params.category.slice(0).toUpperCase()}${i + 1}`)

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
        numProblems: problems.length,
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
</script>

<Playground />

<main class="relative flex h-screen w-screen items-center justify-center">
  <div class="grid w-full max-w-screen-lg p-5">
    <div class="border-brand-red flex flex-col gap-5 border-2 bg-white p-5">
      <div class="text-brand-red font-serif text-6xl">{category} {round}</div>
      <div
        class="grid grid-cols-[max-content_1fr_repeat(9,max-content)] items-center gap-5"
      >
        <div class="contents text-center">
          <div></div>
          <div></div>
          {#each problems as problem}
            <div>{problem}</div>
          {/each}
          <div>T</div>
          <div>Z</div>
          <div>Ta</div>
          <div>Za</div>
        </div>
        {#each competitors as competitor}
          <div class="contents text-3xl">
            <div class="col-start-1">#{competitor.number}</div>
            <div>{competitor.name}</div>
            {#each problems as problem, i}
              <img
                src={getImage(competitor.scores[i + 1])}
                alt={problem}
                class="h-12"
              />
            {/each}
            <div>{competitor.scores.total.t}</div>
            <div>{competitor.scores.total.z}</div>
            <div>{competitor.scores.total.ta}</div>
            <div>{competitor.scores.total.za}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>
