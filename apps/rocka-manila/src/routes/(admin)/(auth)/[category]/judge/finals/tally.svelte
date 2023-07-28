<script lang="ts">
  import { Button, Tile } from 'carbon-components-svelte'
  import attemptIcon from './attempt.svg'
  import zoneIcon from './zone.svg'
  import topIcon from './top.svg'

  export let store: any
  export let competitor: any
  export let problem: any

  $: tallyId = `${competitor.id}:${problem}`
  $: tally = store.hasRow('finals_tally', tallyId)
    ? store.getRow('finals_tally', tallyId)
    : {
        competitor: competitor.id,
        problem,
        attempts: '',
      }

  const attempt = () => {
    tally = {
      ...tally,
      attempts: tally.attempts + 'a',
    }
    store.setRow('finals_tally', tallyId, tally)
  }

  const zone = () => {
    const next = tally.attempts[tally.attempts.length - 1] === 'z' ? 'a' : 'z'
    tally = {
      ...tally,
      attempts: tally.attempts.slice(0, tally.attempts.length - 1) + next,
    }
    store.setRow('finals_tally', tallyId, tally)
  }

  const top = () => {
    const next = tally.attempts[tally.attempts.length - 1] === 'T' ? 'a' : 'T'
    tally = {
      ...tally,
      attempts: tally.attempts.slice(0, tally.attempts.length - 1) + next,
    }
    store.setRow('finals_tally', tallyId, tally)
  }

  const erase = () => {
    tally = {
      competitor: competitor.id,
      problem,
      attempts: tally.attempts.slice(0, tally.attempts.length - 1),
    }
    store.setRow('finals_tally', tallyId, tally)
  }

  const attemptIcons = (attempts: string) => {
    return attempts.split('').map((attempt) => {
      switch (attempt) {
        case 'a':
          return attemptIcon
        case 'z':
          return zoneIcon
        case 'T':
          return topIcon
      }
    })
  }
</script>

<div class="flex flex-col gap-5 items-center p-5 justify-center sticky top-0">
  <h2>{competitor.bib}: {competitor.name} on {problem}</h2>
  <div class="flex gap-5">
    <div class="flex flex-col gap-5 items-center">
      <small>Attempts</small>
      <Tile>
        <div class="text-9xl p-5 flex gap-2 h-20">
          {#each attemptIcons(tally.attempts) as icon}
            <img src={icon} alt="Icon" class="h-10" />
          {/each}
        </div>
      </Tile>
    </div>
  </div>
  <div class="grid grid-cols-3 gap-5">
    <Button kind="secondary" on:click={attempt}>Attempt</Button>
    <Button kind="secondary" disabled={tally.attempts.length < 1} on:click={zone}>Zone</Button>
    <Button kind="secondary" disabled={tally.attempts.length < 1} on:click={top}>Top</Button>
    {#if tally.attempts.length > 0}
      <div class="col-start-2 flex">
        <Button kind="danger-tertiary" on:click={erase} class="flex-1">Erase</Button>
      </div>
    {/if}
  </div>
</div>
