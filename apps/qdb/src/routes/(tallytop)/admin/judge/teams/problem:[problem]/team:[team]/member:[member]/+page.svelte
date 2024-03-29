<script lang="ts">
  import { beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import * as labels from '$lib/labels'
  import { getAttempts } from '$reflect/score'
  import { getTeam, listTeamsSorted, type Team } from '$reflect/team'
  import { Button, Judge, variants } from '@tallytop/ui'
  import { writable } from 'svelte/store'

  const { r } = $page.data

  const problem = $page.params.problem

  let teams: Team[] = []

  r.subscribe(
    (tx) => listTeamsSorted(tx),
    (data) => {
      teams = data
    },
  )

  let team: Team | undefined
  let members: Team['members']
  let member: Team['members'][number]
  let prevMember: Team['members'][number]
  let nextMember: Team['members'][number]
  let nextTeam: Team | undefined

  $: if (team) {
    members = team?.members ?? []
    member = members.find((m) => m.id === $page.params.member)!
    prevMember =
      members[(members.indexOf(member) - 1 + members.length) % members.length]
    nextMember = members[(members.indexOf(member) + 1) % members.length]
    nextTeam =
      teams.indexOf(team) + 1 < teams.length
        ? teams[teams.indexOf(team) + 1]
        : undefined
  }

  r.subscribe(
    (tx) => getTeam(tx, $page.params.team),
    (data) => {
      team = data
    },
  )

  let attemptsKey: string[] = []

  $: if (team && member) {
    attemptsKey = ['teams', team.id, member.id, problem]
  }

  const attempts = writable('')
  const isSaved = writable(false)

  $: if (team) {
    r.subscribe(
      (tx) => getAttempts(tx, attemptsKey),
      async (data) => {
        $attempts = data ?? ''
        $isSaved = true
      },
    )
  }

  const save = async () => {
    if (!team || !member) {
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

{#if member}
  <div class="grid h-full grid-rows-[min-content_1fr_min-content]">
    <div class="flex flex-col p-2 text-center text-3xl">
      <div>{labels.categories[member.category]}</div>
      <div>{member.name}</div>
    </div>
    <Judge {attempts} {isSaved} />
    <div class="grid w-full grid-cols-3 gap-1 p-1">
      <a href={`./member:${prevMember.id}`} class={variants.button()}>
        prev member
      </a>
      <Button on:click={save} variant="primary" disabled={$isSaved}>
        save
      </Button>
      <a href={`./member:${nextMember.id}`} class={variants.button()}>
        next member
      </a>
      <a
        href={nextTeam ? `../team:${nextTeam.id}` : '#'}
        class={variants.button({ class: 'col-start-2', disabled: !nextTeam })}
      >
        next team
      </a>
    </div>
  </div>
{/if}
