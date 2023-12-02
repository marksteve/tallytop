<script lang="ts">
  import { page } from '$app/stores'
  import * as labels from '$lib/labels'
  import type { Score } from '$reflect/score'
  import {
    listTeamsWithScores,
    scoreMultiplier,
    type Team,
  } from '$reflect/team'

  const { r } = $page.data

  const problems = [...Array(6).keys()].map((i) => `P${i + 1}`)

  let teams: Array<Team & { scores: any }> = []

  r.subscribe(listTeamsWithScores, (data) => {
    teams = data.toSorted((a, b) => {
      if (!a.scores?.total || !b.scores?.total) return 0
      const A = a.scores.total
      const B = b.scores.total
      switch (true) {
        case A.t !== B.t:
          return B.t - A.t
        case A.z !== B.z:
          return B.z - A.z
        case A.ta !== B.ta:
          return A.ta - B.ta
        case A.za !== B.za:
          return A.za - B.za
        default:
          return 0
      }
    })
  })

  const getImage = (score: Score) => {
    switch (true) {
      case score?.ta > 0:
        return '/images/whole-with-bolt.png'
      case score?.za > 0:
        return '/images/three-quarters-with-bolts.png'
      default:
        return '/images/half-with-bolts.png'
    }
  }
</script>

<div class="text-brand-red font-serif text-6xl">Teams</div>

{#each teams as team}
  <div
    class="border-brand-red bg-brand-peach mt-5 flex w-full max-w-screen-md flex-col rounded-xl border px-5 pb-5 text-center"
  >
    <div
      class="text-brand-peach bg-brand-red -translate-y-1/2 self-center rounded-full px-3 py-1 text-3xl"
    >
      {team.name}
    </div>
    <div
      class="grid grid-cols-[1fr_repeat(6,max-content)] items-center gap-1 md:grid-cols-[1fr_repeat(10,max-content)] md:gap-x-5"
    >
      <div class="hidden text-xs md:contents">
        <div />
        {#each problems as problem, i}
          <div>{problem}</div>
        {/each}
        <div>T</div>
        <div>Z</div>
        <div>TA</div>
        <div>ZA</div>
      </div>
      {#each team.members as member, i}
        <div
          class="text-brand-red flex items-center gap-1 text-left leading-none col-start-1"
        >
          <div class="relative text-3xl">
            {#if scoreMultiplier[member.category] > 1}
              <div
                class="text-brand-peach bg-brand-red absolute bottom-1/2 right-3/4 h-6 w-6 rounded-full text-center text-xs leading-6"
              >
                x{scoreMultiplier[member.category]}
              </div>
            {/if}
            <div class="relative">{labels.categories[member.category]}</div>
          </div>
          <div>{member.name}</div>
        </div>
        {#each problems as problem, i}
          {#if team?.scores[member.id]?.[i + 1]}
            <img
              src={getImage(team.scores[member.id][i + 1])}
              alt={problem}
              class="h-6"
            />
          {/if}
        {/each}
        {#if team?.scores[member.id]?.total}
          <div class="text-brand-red hidden text-xl md:contents">
            <div class="w-10 col-start-8">{team.scores[member.id].total.t}</div>
            <div class="w-10">{team.scores[member.id].total.z}</div>
            <div class="w-10">{team.scores[member.id].total.ta}</div>
            <div class="w-10">{team.scores[member.id].total.za}</div>
          </div>
        {/if}
      {/each}
    </div>
    {#if team.scores?.total}
      <div class="grid grid-cols-4 justify-around pt-5">
        <div class="text-xs">T</div>
        <div class="text-xs">Z</div>
        <div class="text-xs">TA</div>
        <div class="text-xs">ZA</div>
        <div class="text-brand-red text-xl">{team.scores.total.t}</div>
        <div class="text-brand-red text-xl">{team.scores.total.z}</div>
        <div class="text-brand-red text-xl">{team.scores.total.ta}</div>
        <div class="text-brand-red text-xl">{team.scores.total.za}</div>
      </div>
    {/if}
  </div>
{/each}
