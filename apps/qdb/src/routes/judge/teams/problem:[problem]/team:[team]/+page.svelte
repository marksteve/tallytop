<script lang="ts">
  import * as labels from '$lib/labels'
  import { page } from '$app/stores'
  import { r } from '$lib/reflect'
  import { list, listItem } from '$lib/variants'
  import { getTeam, type Team } from '$reflect/team'

  let team: Team | undefined
  $: members = team?.members ?? []

  r.subscribe(
    (tx) => getTeam(tx, $page.params.team),
    (data) => {
      team = data
    },
  )
</script>

<div class={list()}>
  {#if team}
    {#each members as member}
      <a
        href={`./team:${team.id}/member:${member.id}`}
        class={listItem({ class: 'font-tanker text-3xl gap-2' })}
      >
        <span>{labels.categories[member.category]}</span>
        <span>{member.name}</span>
      </a>
    {/each}
  {/if}
</div>
