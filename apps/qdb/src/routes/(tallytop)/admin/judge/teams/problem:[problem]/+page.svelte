<script lang="ts">
  import { page } from '$app/stores'
  import { listTeamsSorted, type Team } from '$reflect/team'
  import { variants } from '@tallytop/ui'

  const { r } = $page.data

  let teams: Team[] = []

  r.subscribe(
    (tx) => listTeamsSorted(tx),
    (data) => {
      teams = data
    },
  )
</script>

<div class={variants.list()}>
  {#each teams as team}
    <a
      href={`./problem:${$page.params.problem}/team:${team.id}`}
      class={variants.listItem({ class: 'text-3xl' })}
    >
      {team.name}
    </a>
  {/each}
</div>
