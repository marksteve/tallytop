<script lang="ts">
  import { page } from '$app/stores'
  import { r } from '$lib/reflect'
  import { listTeams, type Team } from '$reflect/team'
  import { variants } from '@tallytop/ui'

  let teams: Team[] = []

  r.subscribe(
    (tx) => listTeams(tx),
    (data) => {
      teams = data
    },
  )
</script>

<div class={variants.list()}>
  {#each teams as team}
    <a
      href={`./problem:${$page.params.problem}/team:${team.id}`}
      class={variants.listItem({ class: 'font-tanker text-3xl' })}
    >
      {team.name}
    </a>
  {/each}
</div>
