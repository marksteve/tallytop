<script lang="ts">
  import { page } from '$app/stores'
  import Logo from '$lib/components/logo.svelte'
  import { listTeamsWithScores, type Team } from '$reflect/team'
  import 'app.css'

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
</script>

<div class="flex flex-col items-center gap-5 p-5">
  <div class="flex items-center gap-5">
    <img src="/images/logo-mono.svg" alt="QDB Logo" class="h-20" />
    <img src="/images/bhive-mono.svg" alt="BHive Logo" class="h-20" />
  </div>

  <div class="font-serif text-6xl">Teams</div>

  <div class="grid w-full max-w-screen-lg grid-cols-3 gap-y-2">
    <div></div>
    <div class="flex justify-around border-b border-current text-xs">
      {#each problems as problem}
        <div>{problem}</div>
      {/each}
    </div>
    <div class="flex justify-around border-b border-current text-xs">
      <div>T</div>
      <div>Z</div>
      <div>TA</div>
      <div>ZA</div>
    </div>
    {#each teams as team}
      <div class="col-start-1 text-xl">
        {team.name}
      </div>
      {#each team.members as member, i}
        <div class="col-start-1 border-b border-current text-lg">
          {member.name}
        </div>
        <div class="flex justify-around border-b border-current items-center">
          {#each problems as problem, i}
            <div class="text-center text-xs">
              {#if team?.scores[member.id]?.[i + 1]}
                T{team.scores[member.id][i + 1].ta}
                Z{team.scores[member.id][i + 1].za}
              {/if}
            </div>
          {/each}
        </div>
        {#if team?.scores[member.id]?.total}
          <div class="flex justify-around border-b border-current">
            <div>{team.scores[member.id].total.t}</div>
            <div>{team.scores[member.id].total.z}</div>
            <div>{team.scores[member.id].total.ta}</div>
            <div>{team.scores[member.id].total.za}</div>
          </div>
        {/if}
      {/each}
      {#if team.scores?.total}
        <div />
        <div />
        <div class="flex justify-around">
          <div>{team.scores.total.t}</div>
          <div>{team.scores.total.z}</div>
          <div>{team.scores.total.ta}</div>
          <div>{team.scores.total.za}</div>
        </div>
      {/if}
    {/each}
  </div>
  <div class="flex flex-col items-center gap-1 text-xs">
    Scoring platform by <Logo mono />
  </div>
</div>
