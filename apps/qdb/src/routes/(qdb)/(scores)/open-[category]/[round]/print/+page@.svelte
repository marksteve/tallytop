<script lang="ts">
  import { page } from '$app/stores'
  import Star from '$lib/components/star.svelte'
  import Logo from '$lib/components/logo.svelte'
  import {
    listCompetitorsByCategory,
    listCompetitorsWithScores,
    type CompetitorWithScores,
  } from '$reflect/competitor'
  import { listPromotedCompetitors } from '$reflect/score'
  import 'app.css'

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
</script>

<div class="flex flex-col items-center gap-5 p-5">
  <div class="flex items-center gap-5">
    <img src="/images/logo-mono.svg" alt="QDB Logo" class="h-20" />
    <img src="/images/bhive-mono.svg" alt="BHive Logo" class="h-20" />
  </div>

  <div class="font-serif text-6xl">
    {categoryTitle}
  </div>

  <div
    class="flex items-center gap-1 rounded-full border border-current px-2 uppercase leading-8"
  >
    <Star class="text-lg" />
    {roundTitles[round]}
    <Star class="text-lg" />
  </div>

  <div class="grid w-full max-w-screen-md grid-cols-3 gap-y-2">
    <div></div>
    <div class="flex justify-around border-b border-current text-xs">
      {#each problems as problem}
        <div>{problem}</div>
      {/each}
    </div>
    <div class="flex justify-around border-b border-current text-xs">
      <div>T</div>
      <div>Z</div>
      <div>TA</div>
      <div>ZA</div>
    </div>
    {#each competitors as competitor}
      <div class="col-start-1 border-b border-current text-xl">
        #{competitor.number}
        {competitor.name}
      </div>
      <div class="flex justify-around border-b border-current">
        {#each problems as _, i}
          <div class="text-center">
            {#if competitor.scores?.[i + 1]}
              T{competitor.scores[i + 1].ta}
              Z{competitor.scores[i + 1].za}
            {/if}
          </div>
        {/each}
      </div>
      {#if competitor.scores?.total}
        <div class="flex justify-around border-b border-current">
          <div>{competitor.scores.total.t}</div>
          <div>{competitor.scores.total.z}</div>
          <div>{competitor.scores.total.ta}</div>
          <div>{competitor.scores.total.za}</div>
        </div>
      {/if}
    {/each}
  </div>
  <div class="flex flex-col items-center gap-1 text-xs">
    Scoring platform by <Logo mono />
  </div>
</div>
