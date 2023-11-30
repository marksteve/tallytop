<script lang="ts">
  import { page } from '$app/stores'
  import * as labels from '$lib/labels'
  import { getTeam, type Team } from '$reflect/team'
  import { variants } from '@tallytop/ui'

  const { r } = $page.data

  let team: Team | undefined
  $: members = team?.members ?? []

  r.subscribe(
    (tx) => getTeam(tx, $page.params.team),
    (data) => {
      team = data
    },
  )
</script>

<div class={variants.list()}>
  {#if team}
    {#each members as member}
      <a
        href={`./team:${team.id}/member:${member.id}`}
        class={variants.listItem({ class: 'gap-2 text-3xl' })}
      >
        <span>{labels.categories[member.category]}</span>
        <span>{member.name}</span>
      </a>
    {/each}
  {/if}
</div>
