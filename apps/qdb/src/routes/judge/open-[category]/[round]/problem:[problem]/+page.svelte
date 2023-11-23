<script lang="ts">
  import { beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import { r } from '$lib/reflect'
  import { list, listItem } from '$lib/variants'
  import {
    listCompetitorsByCategory,
    type Competitor,
  } from '$reflect/competitor'

  let subscribers: Array<() => void> = []
  let competitors: Competitor[] = []

  $: category = `open-${$page.params.category}`

  beforeNavigate(() => {
    subscribers.forEach((unsubscribe) => unsubscribe())
  })

  $: subscribers = [
    ...subscribers,
    r.subscribe(
      (tx) => listCompetitorsByCategory(tx, category),
      (data) => {
        competitors = data
      },
    ),
  ]
</script>

<div class={list()}>
  {#each competitors as competitor}
    <a
      href={`./problem:${$page.params.problem}/competitor:${competitor.id}`}
      class={listItem({ class: 'font-tanker flex gap-2 text-3xl' })}
    >
      <span class="text-slate-400">#{competitor.number}</span>
      {competitor.name}
    </a>
  {/each}
</div>
