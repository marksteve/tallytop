<script lang="ts">
  import { page } from '$app/stores'
  import Button from '$lib/components/button.svelte'
  import Judge from '$lib/components/judge.svelte'
  import { r } from '$lib/reflect'
  import { button } from '$lib/variants'
  import {
    getCompetitor,
    listCompetitorsByCategory,
    type Competitor,
  } from '$reflect/competitor'
  import { writable } from 'svelte/store'

  $: category = `open-${$page.params.category}`
  $: round = $page.params.round
  $: problem = $page.params.problem

  let competitor: Competitor | undefined
  let prevCompetitor: Competitor | undefined
  let nextCompetitor: Competitor | undefined

  $: r.subscribe(
    (tx) => listCompetitorsByCategory(tx, category),
    (data) => {
      const competitorIndex = data
        .map((c) => c.id)
        .indexOf($page.params.competitor)
      competitor = data[competitorIndex]
      prevCompetitor = data[competitorIndex - 1]
      nextCompetitor = data[competitorIndex + 1]
    },
  )
  $: r.subscribe(
    (tx) => getCompetitor(tx, $page.params.competitor),
    (data) => {
      competitor = data
    },
  )

  let attemptsKey = ''

  $: if (competitor) {
    attemptsKey = [category, round, problem, competitor.id].join('/')
  }

  const attempts = writable('')
  const isSaved = writable(false)

  $: r.subscribe(
    (tx) => tx.get<string>(attemptsKey),
    async (data) => {
      $attempts = data ?? ''
      $isSaved = true
    },
  )

  const save = async () => {
    if (!competitor || !$attempts) {
      return
    }
    await r.mutate.putAttempts({
      key: attemptsKey,
      value: $attempts,
    })
    $isSaved = true
  }
</script>

{#if competitor}
  <div class="font-tanker grid h-full grid-rows-[min-content_1fr_min-content]">
    <div class="flex justify-center gap-2 p-2 text-3xl">
      <div class="text-slate-400">#{competitor.number}</div>
      <div>{competitor.name}</div>
    </div>
    <Judge {attempts} {isSaved} />
    <div class="grid w-full grid-cols-3 gap-1 p-1">
      {#if prevCompetitor}
        <a href={`./competitor:${prevCompetitor.id}`} class={button()}>prev</a>
      {:else}
        <div class={button({ disabled: true })}>prev</div>
      {/if}
      <Button on:click={save} variant="primary" disabled={$isSaved}>
        Save
      </Button>
      {#if nextCompetitor}
        <a href={`./competitor:${nextCompetitor.id}`} class={button()}>next</a>
      {:else}
        <div class={button({ disabled: true })}>next</div>
      {/if}
    </div>
  </div>
{/if}
