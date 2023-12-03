<script lang="ts">
  import { page } from '$app/stores'
  import {
    listCompetitorsByCategory,
    type Competitor,
  } from '$reflect/competitor'

  const { r } = $page.data

  $: category = `open-${$page.params.category}`

  let competitors: Competitor[] = []

  r.subscribe(
    async (tx) => {
      const competitors = await listCompetitorsByCategory(tx, category)
      const cheers = await tx.scan({ prefix: 'cheers/' }).entries().toArray()
      const claps = new Map<string, number>()
      for (const [key, value] of cheers) {
        const [_1, _2, competitor] = key.split('/')
        claps.set(competitor, value)
      }
      return { competitors, claps }
    },
    (data) => {
      competitors = data.competitors
        .map((competitor) => ({
          ...competitor,
          claps: data.claps.get(competitor.id) ?? 0,
        }))
        .toSorted((a, b) => b.claps - a.claps)
    },
  )
</script>

<div class="text-brand-red font-serif text-6xl">Claps</div>

{#each competitors as competitor}
  <div
    class="border-brand-red bg-brand-peach relative grid w-full max-w-screen-md grid-cols-2 items-center gap-2 overflow-hidden rounded-xl border p-5 text-center"
  >
    <div class="relative text-3xl md:text-left">
      #{competitor.number}
      {competitor.name}
    </div>
    <div class="relative text-6xl text-brand-red">
      {competitor.claps}
      👏
    </div>
  </div>
{/each}
