<script lang="ts">
  import { page } from '$app/stores'
  import { attemptsToText } from '$lib/attempts'
  import Button from '$lib/components/button.svelte'
  import * as labels from '$lib/labels'
  import { r } from '$lib/reflect'
  import { getTeam, type Team } from '$reflect/team'

  $: problem = $page.params.problem

  let team: Team | undefined
  $: members = team?.members ?? []
  $: member = members.find((m) => m.id === $page.params.member)

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
  <img src="/images/logo.png" alt="Logo" class="w-24" />
  <h1 class="text-brand-red font-serif text-6xl">Problem {problem}</h1>
  {#if member}
    <div class="text-3xl">{labels.categories[member.category]}</div>
    <div class="text-6xl">{member.name}</div>
    <div class="flex h-8 flex-wrap justify-center gap-2">
      {#each attempts as attempt}
        <img src={images[attempt]} alt={attempt} class="w-8" />
      {/each}
    </div>
    <div class="text-3xl">{attemptsToText(attempts)}</div>
    <div class="grid grid-cols-3 gap-2">
      {#each Object.entries(labels.attempts) as [key, label]}
        <button
          on:click={actions[key]}
          class="text-brand-red flex items-center gap-2 rounded-full border border-current p-2 text-sm uppercase"
        >
          <img src={images[key]} alt={label} class="w-4" />
          {label}
        </button>
      {/each}
      <button
        on:click={erase}
        class="text-brand-red col-start-2 rounded-full border border-current p-2 text-center text-sm uppercase"
      >
        Erase
      </button>
    </div>
    <Button on:click={save} class="!px-5 text-3xl">Save</Button>
  {/if}
</div>
