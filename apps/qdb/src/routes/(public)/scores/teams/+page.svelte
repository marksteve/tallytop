<script lang="ts">
  import Playground from '$lib/components/playground.svelte'
  import * as labels from '$lib/labels'
  import { r } from '$lib/reflect'
  import { type Score } from '$reflect/score'
  import {
    listTeamsWithScores,
    scoreMultiplier,
    type Team,
  } from '$reflect/team'

  const problems = [...Array(6).keys()].map((i) => `P${i + 1}`)

  let teams: Array<Team & { scores: any }> = []

  r.subscribe(listTeamsWithScores, (data) => {
    teams = data.toSorted((a, b) => {
      if (!a.scores.total || !b.scores.total) return 0
      const A = a.scores.total
      const B = b.scores.total
      switch (true) {
        case A.t !== B.t:
          return B.t - A.t
        case A.ta !== B.ta:
          return A.ta - B.ta
        case A.z !== B.z:
          return B.z - A.z
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

<Playground />

<main class="relative flex h-screen w-screen items-center justify-center">
  <div class="grid w-full max-w-screen-lg p-5">
    <div class="border-brand-red flex flex-col gap-5 border-2 bg-white p-5">
      <div class="text-brand-red font-serif text-6xl">Teams</div>
      <div
        class="grid grid-cols-[max-content_1fr_repeat(10,max-content)] items-center gap-5"
      >
        <div></div>
        <div></div>
        <div class="contents text-center">
          {#each problems as problem}
            <div>{problem}</div>
          {/each}
        </div>
        <div>T</div>
        <div>Z</div>
        <div>Ta</div>
        <div>Za</div>
        {#each teams as team}
          <div class="contents text-2xl">
            {#each team.members as member, i}
              <div class="col-start-1">
                {#if i === 0}{team.name}{/if}
              </div>
              <div>{labels.categories[member.category]} {member.name}</div>
              {#each problems as problem, i}
                {#if team.scores[member.id][i + 1]}
                  <img
                    src={getImage(team.scores[member.id][i + 1])}
                    alt={problem}
                    class="h-8"
                  />
                {/if}
              {/each}
              {#if team.scores[member.id].total}
                <div>
                  {team.scores[member.id].total.t}
                  {#if scoreMultiplier[member.category] > 1}
                    <span class="align-middle text-base">
                      &times; {scoreMultiplier[member.category]}
                    </span>
                  {/if}
                </div>
                <div>
                  {team.scores[member.id].total.z}
                  {#if scoreMultiplier[member.category] > 1}
                    <span class="align-middle text-base">
                      &times; {scoreMultiplier[member.category]}
                    </span>
                  {/if}
                </div>
                <div>{team.scores[member.id].total.ta}</div>
                <div>{team.scores[member.id].total.za}</div>
              {/if}
            {/each}
            <div class="col-start-9">{team.scores.total.t}</div>
            <div>{team.scores.total.z}</div>
            <div>{team.scores.total.ta}</div>
            <div>{team.scores.total.za}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>
