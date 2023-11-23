<script lang="ts">
  import { page } from '$app/stores'
  import { attemptsToText } from '$lib/attempts'
  import Button from '$lib/components/button.svelte'
  import * as labels from '$lib/labels'
  import { r } from '$lib/reflect'
  import { button } from '$lib/variants'
  import {
    getCompetitor,
    listCompetitorsByCategory,
    type Competitor,
  } from '$reflect/competitor'
  import { cva } from 'class-variance-authority'
  import { tick } from 'svelte'

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
  let attempts = ''
  let isSaved = false

  $: if (competitor) {
    attemptsKey = [category, round, problem, competitor.id].join('/')
  }
  $: r.subscribe(
    (tx) => tx.get<string>(attemptsKey),
    async (data) => {
      attempts = data ?? ''
      await tick()
      isSaved = true
    },
  )
  $: {
    attempts
    isSaved = false
  }

  const attempt = () => {
    attempts = attempts + 'a'
  }

  const zone = () => {
    attempts = attempts.slice(0, -1) + (attempts.endsWith('z') ? 'a' : 'z')
  }

  const top = () => {
    attempts = attempts.slice(0, -1) + (attempts.endsWith('t') ? 'a' : 't')
  }

  const erase = () => {
    attempts = attempts.slice(0, -1)
  }

  const actions: Record<string, () => void> = {
    a: attempt,
    z: zone,
    t: top,
  }

  const icons: Record<string, string> = {
    a: '/attempt.svg',
    z: '/zone.svg',
    t: '/top.svg',
  }

  const save = async () => {
    if (!competitor) {
      return
    }
    await r.mutate.putAttempts({
      key: attemptsKey,
      value: attempts,
    })
    isSaved = true
  }

  let fullScore = false

  const toggleFullScore = () => {
    fullScore = !fullScore
  }

  const scoreModal = cva('p-4', {
    variants: {
      fullScore: {
        true: [
          'absolute',
          'bg-white',
          'flex',
          'inset-0',
          'items-center',
          'justify-center',
          'leading-none',
          'text-[80vmin]',
          'text-center',
        ],
        false: 'text-3xl',
      },
    },
  })
</script>

{#if competitor}
  <div class="font-tanker grid grid-rows-[min-content_1fr_min-content]">
    <div class="flex justify-center gap-2 p-2 text-3xl">
      <div class="text-slate-400">#{competitor.number}</div>
      <div>{competitor.name}</div>
    </div>
    <div class="flex flex-col items-center justify-center gap-1 bg-white">
      <div class="flex h-8 flex-wrap justify-center gap-2 p-4">
        {#each attempts as attempt}
          <img src={icons[attempt]} alt={attempt} />
        {/each}
      </div>
      <div class={scoreModal({ fullScore })} on:click={toggleFullScore}>
        {attemptsToText(attempts)}
      </div>
      <div class="grid grid-cols-2 gap-1">
        {#each Object.entries(labels.attempts) as [key, label]}
          <Button on:click={actions[key]}>{label}</Button>
        {/each}
        <Button on:click={erase}>Erase</Button>
      </div>
    </div>
    <div class="grid w-full grid-cols-3 gap-1 p-1">
      {#if prevCompetitor}
        <a href={`./competitor:${prevCompetitor.id}`} class={button()}>prev</a>
      {:else}
        <div class={button({ disabled: true })}>prev</div>
      {/if}
      <Button on:click={save} variant="primary" disabled={isSaved}>Save</Button>
      {#if nextCompetitor}
        <a href={`./competitor:${nextCompetitor.id}`} class={button()}>next</a>
      {:else}
        <div class={button({ disabled: true })}>next</div>
      {/if}
    </div>
  </div>
{/if}
