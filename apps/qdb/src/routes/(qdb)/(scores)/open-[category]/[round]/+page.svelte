<script lang="ts">
  import { page } from '$app/stores'
  import Star from '$lib/components/Star.svelte'
  import {
    listCompetitorsByCategory,
    listCompetitorsWithScores,
    type CompetitorWithScores,
  } from '$reflect/competitor'
  import { listPromotedCompetitors, type Score } from '$reflect/score'

  const { r } = $page.data

  $: category = `open-${$page.params.category}`
  $: round = $page.params.round

  $: categoryTitle = {
    'open-m': `Open Men's`,
    'open-w': `Open Women's`,
  }[category]

  const roundTitles = {
    qualis: 'Qualifiers',
    finals: 'Finals',
  }

  $: problems = [
    ...Array(
      {
        qualis: 5,
        finals: 4,
      }[round],
    ).keys(),
  ].map((i) => `${$page.params.category.slice(0).toUpperCase()}${i + 1}`)

  let competitors: CompetitorWithScores[] = []

  $: attemptsPrefix = [category, round]

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
</script>

<div class="text-brand-red font-serif text-6xl">
  {categoryTitle}
</div>

<div class="flex gap-5">
  {#each Object.entries(roundTitles) as [r, title]}
    <a
      href="./{r}"
      class:bg-brand-red={round === r}
      class:text-brand-peach={round === r}
      class="text-brand-red border-brand-red flex items-center gap-1 rounded-full border px-2 uppercase leading-8"
    >
      <Star class="text-brand-yellow text-lg" />
      {title}
      <Star class="text-brand-yellow text-lg" />
    </a>
  {/each}
</div>

{#each competitors as competitor}
  <div
    class="border-brand-red bg-brand-peach relative flex w-full max-w-screen-md flex-col gap-2 rounded-xl border p-5 text-center md:grid md:grid-cols-2"
  >
    <div class="text-3xl md:text-left">
      #{competitor.number}
      {competitor.name}
    </div>
    <div class="row-span-2 flex justify-between md:items-center">
      {#each problems as problem, i}
        <div class="text-center">
          {#if competitor.scores?.[i + 1]}
            {problem}
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
      <div class="grid grid-cols-4 justify-around md:justify-between">
        <div class="text-xs">T</div>
        <div class="text-xs">Z</div>
        <div class="text-xs">TA</div>
        <div class="text-xs">ZA</div>
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
    <button
      class="bg-brand-red absolute left-full top-0 flex h-8 w-8 -translate-x-2/3 -translate-y-1/3 items-center justify-center rounded-full text-xl transition-transform active:scale-150"
    >
      👏
    </button>
  </div>
{/each}
