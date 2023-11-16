<script lang="ts">
  import { page } from '$app/stores'
  import Button from '$lib/components/button.svelte'
  import * as labels from '$lib/labels'
  import { r } from '$lib/reflect'
  import { getTeam, type Team } from '$reflect/team'
  import { Splide, SplideSlide } from '@splidejs/svelte-splide'
  import type { SplideEvents } from '@splidejs/svelte-splide/components/Splide/Splide.svelte'

  let team: Team | undefined
  $: members = team?.members ?? []

  r.subscribe(
    (tx) => getTeam(tx, $page.params.team),
    (data) => {
      team = data
    },
  )

  let selectedMember: Team['members'][number] | undefined
  $: selectedMember = members[0]

  const selectMember = (e: SplideEvents['active']) => {
    selectedMember = members[e.detail.Slide.index]
  }
</script>

<div class="flex flex-col items-center gap-5 p-5">
  <img src="/images/logo.png" alt="Logo" class="w-24" />
  <h1 class="text-brand-red font-serif text-6xl">Judge Teams</h1>
  <Splide
    class="w-full"
    options={{
      direction: 'ttb',
      gap: 20,
      heightRatio: 1,
      pagination: false,
    }}
    on:active={selectMember}
  >
    {#each members as member}
      <SplideSlide>
        <div
          class="text-brand-red flex h-full flex-col items-center justify-center rounded-full border border-current"
        >
          <div class="font-serif text-3xl">
            {labels.categories[member.category]}
          </div>
          <div class="text-center text-6xl">{member.name}</div>
        </div>
      </SplideSlide>
    {/each}
  </Splide>
  <Button class="text-3xl">
    <a
      href={`/judge/teams/problem:${$page.params.problem}/team:${team?.id}/member:${selectedMember?.id}`}
    >
      Go
    </a>
  </Button>
</div>
