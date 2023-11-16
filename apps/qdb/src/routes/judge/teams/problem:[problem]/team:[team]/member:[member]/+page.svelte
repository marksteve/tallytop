<script lang="ts">
  import { page } from '$app/stores'
  import { attemptsToText } from '$lib/attempts'
  import Button from '$lib/components/button.svelte'
  import * as labels from '$lib/labels'
  import { r } from '$lib/reflect'
  import { getTeam, listTeams, type Team } from '$reflect/team'

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

  $: if (team && member) {
    attemptsKey = ['teams', problem, team.id, member.id].join('/')
  }
  $: r.subscribe(
    (tx) => tx.get<string>(attemptsKey),
    (data) => {
      attempts = data ?? ''
    },
  )

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

  const images: Record<string, string> = {
    a: '/images/half.png',
    z: '/images/three-quarters.png',
    t: '/images/whole.png',
  }

  const save = async () => {
    if (!team || !member) {
      return
    }
    await r.mutate.putAttempts({
      key: attemptsKey,
      value: attempts,
    })
  }
</script>

<div class="flex flex-col items-center gap-5 p-5">
  <img src="/images/logo.png" alt="Logo" class="w-16" />
  <h1 class="text-brand-red font-serif text-3xl">Problem {problem}</h1>
  {#if member}
    <div class="text-3xl">{labels.categories[member.category]}</div>
    <div class="text-3xl">{member.name}</div>
    <div
      class="flex flex-col items-center gap-5 rounded-3xl border bg-white p-5"
    >
      <div class="flex h-8 flex-wrap justify-center gap-2">
        {#each attempts as attempt}
          <img src={images[attempt]} alt={attempt} class="w-8" />
        {/each}
      </div>
      <div class="text-3xl">{attemptsToText(attempts)}</div>
      <div class="grid grid-cols-2 gap-2">
        {#each Object.entries(labels.attempts) as [key, label]}
          <button
            on:click={actions[key]}
            class="text-brand-red bg-brand-peach flex items-center gap-2 rounded-full border border-current p-2 text-xs uppercase"
          >
            <img src={images[key]} alt={label} class="w-4" />
            {label}
          </button>
        {/each}
        <button
          on:click={erase}
          class="bg-brand-red text-brand-peach rounded-full border border-current p-2 text-center text-xs uppercase"
        >
          Erase
        </button>
      </div>
    </div>
    <div class="grid w-full grid-cols-4 items-center gap-5">
      <Button>
        <a href={`./member:${prevMember.id}`}>&larr;</a>
      </Button>
      <Button on:click={save} class="col-span-2 !px-5 text-3xl">Save</Button>
      <Button>
        <a href={`./member:${nextMember.id}`}>&rarr;</a>
      </Button>
    </div>
    <a
      href={`../team:${nextTeam.id}`}
      class="rounded-full border border-current px-2 text-sm uppercase leading-loose"
    >
      Next Team
    </a>
  {/if}
</div>
