<script lang="ts">
  import { page } from '$app/stores'
  import { r } from '$lib/reflect'
  import * as labels from '$lib/labels'
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
</script>

<div class="flex flex-col items-center gap-5 p-5">
  <img src="/images/logo.png" alt="Logo" class="w-24" />
  <h1 class="text-brand-red font-serif text-6xl">Judge Teams</h1>
  <h2>Problem {problem}</h2>
  {#if member}
    <div class="text-3xl">{labels.categories[member.category]}</div>
    <div class="text-6xl">{member.name}</div>
  {/if}
</div>
