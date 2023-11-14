<script lang="ts">
  import { page } from '$app/stores'
  import Button from '$lib/components/button.svelte'
  import { r } from '$lib/reflect'
  import { listTeams, type Team } from '$reflect/team'
  import { Splide, SplideSlide } from '@splidejs/svelte-splide'
  import type { SplideEvents } from '@splidejs/svelte-splide/components/Splide/Splide.svelte'
  import '@splidejs/svelte-splide/css'

  let teams: Team[] = []

  r.subscribe(
    (tx) => listTeams(tx),
    (data) => {
      teams = data
    },
  )

  let selectedTeam: Team
  $: selectedTeam = teams[0]

  const selectTeam = (e: SplideEvents['active']) => {
    selectedTeam = teams[e.detail.Slide.index]
  }
</script>

<div class="flex flex-col items-center gap-5 p-5">
  <img src="/images/logo.png" alt="Logo" class="w-24" />
  <h1 class="text-brand-red font-serif text-6xl">Judge Teams</h1>
  <Splide
    class="w-full"
    options={{
      arrows: false,
      pagination: false,
      gap: 20,
      heightRatio: 1,
    }}
    on:active={selectTeam}
  >
    {#each teams as team}
      <SplideSlide>
        <div
          class="text-brand-red flex h-full flex-col items-center justify-center rounded-tl-full rounded-tr-full border border-current"
        >
          <div class="font-serif text-3xl">Team</div>
          <div class="text-6xl">{team.name}</div>
        </div>
      </SplideSlide>
    {/each}
  </Splide>
  <Button class="text-3xl">
    <a href={`/judge/teams/${$page.params.problem}/${selectedTeam?.id}`}>
      Go
    </a>
  </Button>
</div>
