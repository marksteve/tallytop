<script lang="ts">
  import { qualisScore } from '$lib/rules'
  import { store } from '$lib/tinybase'
  import { Button, Tile } from 'carbon-components-svelte'

  export let competitor: any
  export let problem: any

  $: tallyId = `${competitor.id}:${problem}`
  $: tally = store.hasRow('qualis_tally', tallyId)
    ? store.getRow('qualis_tally', tallyId)
    : {
        competitor: competitor.id,
        problem,
        attempts: 0,
        top: false,
      }
  $: score = qualisScore(tally)

  const incAttempts = () => {
    tally = {
      ...tally,
      attempts: tally.attempts + 1,
    }
    store.setRow('qualis_tally', tallyId, tally)
  }

  const decAttempts = () => {
    tally = {
      ...tally,
      attempts: Math.max(0, tally.attempts - 1),
    }
    if (tally.attempts < 1) {
      tally.top = false
    }
    store.setRow('qualis_tally', tallyId, tally)
  }

  const toggleTop = () => {
    tally = {
      ...tally,
      top: !tally.top,
    }
    store.setRow('qualis_tally', tallyId, tally)
  }

  const clear = () => {
    tally = {
      competitor: competitor.id,
      problem,
      attempts: 0,
      top: false,
    }
    store.delRow('qualis_tally', tallyId)
  }
</script>

<div class="flex flex-col gap-5 items-center p-5 justify-center sticky top-0">
  <h2>{competitor.bib}: {competitor.name} on {problem}</h2>
  <div class="flex gap-5">
    <div class="flex flex-col gap-5 items-center">
      <small>Attempts</small>
      <Tile><div class="text-9xl p-5">{tally.attempts}</div></Tile>
    </div>
    <div class="flex flex-col gap-5 items-center">
      <small>Score</small>
      <Tile><div class="text-9xl p-5">{score.toFixed(2)}</div></Tile>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-5">
    <Button kind="secondary" on:click={decAttempts}>-</Button>
    <Button kind="secondary" on:click={incAttempts}>+</Button>
    <div class:invisible={tally.attempts < 1} class="col-span-2 flex">
      <Button kind={tally.top ? 'primary' : 'tertiary'} on:click={toggleTop} class="flex-1">
        Top
      </Button>
    </div>
    {#if tally.attempts}
      <div class="col-span-2 flex">
        <Button kind="danger-tertiary" on:click={clear} class="flex-1">Clear</Button>
      </div>
    {/if}
  </div>
</div>
