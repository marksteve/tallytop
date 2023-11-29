<script lang="ts">
  import { beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import { r } from '$lib/reflect'
  import {
    listCompetitorsByCategory,
    type Competitor,
  } from '$reflect/competitor'
  import { getAttempts, listPromotedCompetitors } from '$reflect/score'
  import { Button, Judge, variants } from '@tallytop/ui'
  import { writable } from 'svelte/store'

  const category = `open-${$page.params.category}`
  const round = $page.params.round
  const problem = $page.params.problem

  let competitors: Competitor[] = []
  let competitor: Competitor | undefined
  let prevCompetitor: Competitor | undefined
  let nextCompetitor: Competitor | undefined

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

  $: if (competitors.length > 0) {
    const competitorIndex = competitors
      .map((c) => c.id)
      .indexOf($page.params.competitor)
    competitor = competitors[competitorIndex]
    prevCompetitor = competitors[competitorIndex - 1]
    nextCompetitor = competitors[competitorIndex + 1]
  }

  let attemptsKey: string[] = []

  $: if (competitor) {
    attemptsKey = [category, round, competitor.id, problem]
  }

  const attempts = writable('')
  const isSaved = writable(false)

  $: if (attemptsKey.length > 0) {
    r.subscribe(
      (tx) => getAttempts(tx, attemptsKey),
      async (data) => {
        $attempts = data ?? ''
        $isSaved = true
      },
    )
  }

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

  beforeNavigate(() => save())
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
        <a href={`./competitor:${prevCompetitor.id}`} class={variants.button()}>
          prev
        </a>
      {:else}
        <div class={variants.button({ disabled: true })}>prev</div>
      {/if}
      <Button on:click={save} variant="primary" disabled={$isSaved}>
        save
      </Button>
      {#if nextCompetitor}
        <a href={`./competitor:${nextCompetitor.id}`} class={variants.button()}>
          next
        </a>
      {:else}
        <div class={variants.button({ disabled: true })}>next</div>
      {/if}
    </div>
  </div>
{/if}
