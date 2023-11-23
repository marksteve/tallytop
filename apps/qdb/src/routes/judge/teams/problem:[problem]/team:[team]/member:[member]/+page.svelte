<script lang="ts">
  import { page } from '$app/stores'
  import { attemptsToText } from '$lib/attempts'
  import Button from '$lib/components/button.svelte'
  import * as labels from '$lib/labels'
  import { r } from '$lib/reflect'
  import { button, scoreModal } from '$lib/variants'
  import { getTeam, listTeams, type Team } from '$reflect/team'
  import { tick } from 'svelte'

  $: problem = $page.params.problem

  let teams: Team[] = []

  r.subscribe(
    (tx) => listTeams(tx),
    (data) => {
      teams = data
    },
  )

  let team: Team | undefined
  let members: Team['members']
  let member: Team['members'][number]
  let prevMember: Team['members'][number]
  let nextMember: Team['members'][number]
  let nextTeam: Team

  $: if (team) {
    members = team?.members ?? []
    member = members.find((m) => m.id === $page.params.member)!
    prevMember =
      members[(members.indexOf(member) - 1 + members.length) % members.length]
    nextMember = members[(members.indexOf(member) + 1) % members.length]
    nextTeam = teams[(teams.indexOf(team) + 1) % teams.length]
  }

  r.subscribe(
    (tx) => getTeam(tx, $page.params.team),
    (data) => {
      team = data
    },
  )

  let attemptsKey = ''
  let attempts = ''
  let isSaved = false

  $: if (team && member) {
    attemptsKey = ['teams', problem, team.id, member.id].join('/')
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
    if (!team || !member) {
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
</script>

{#if member}
  <div class="font-tanker grid h-full grid-rows-[min-content_1fr_min-content]">
    <div class="flex flex-col p-2 text-center text-3xl">
      <div>{labels.categories[member.category]}</div>
      <div>{member.name}</div>
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
      <a href={`./member:${prevMember.id}`} class={button()}>prev</a>
      <Button on:click={save} variant="primary" disabled={isSaved}>Save</Button>
      <a href={`./member:${nextMember.id}`} class={button()}>next</a>
      <a
        href={`../team:${nextTeam.id}`}
        class={button({ class: 'col-start-2' })}
      >
        next team
      </a>
    </div>
  </div>
{/if}
