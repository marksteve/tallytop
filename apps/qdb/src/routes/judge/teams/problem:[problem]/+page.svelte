<script lang="ts">
  import { page } from '$app/stores'
  import { r } from '$lib/reflect'
  import { list, listItem } from '$lib/variants'
  import { listTeams, type Team } from '$reflect/team'

  let teams: Team[] = []

  r.subscribe(
    (tx) => listTeams(tx),
    (data) => {
      teams = data
    },
  )
</script>

<div class={list()}>
  {#each teams as team}
    <a
      href={`./problem:${$page.params.problem}/team:${team.id}`}
      class={listItem({ class: 'font-tanker text-3xl' })}
    >
      {team.name}
    </a>
  {/each}
</div>
