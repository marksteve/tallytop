<script>
  /** @type {import('./$types').PageData} */
  export let data
</script>

<table class="border-separate border-2 border-secondary">
  <thead>
    <tr>
      <th rowspan="2" class="w-1/6 border-b" />
      <th rowspan="2" class="border-b text-left">Competitor</th>
      {#each data.problems as problem}
        <th colspan={data.attempts}>{problem}</th>
      {/each}
    </tr>
    <tr>
      {#each data.problems as _}
        {#each Array(data.attempts) as _, i}
          <th class="bg-secondary text-white">{i + 1}</th>
        {/each}
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each data.novice.competitors as competitor, i}
      <tr>
        {#if i === 0}
          <td rowspan={data.novice.competitors.length} class="-rotate-90 text-center text-xl">
            Novice
          </td>
        {/if}
        <td>{competitor.name}</td>
        {#each competitor.problems as problem, p}
          {#each problem.scores as score, scoreIndex}
            <td
              class="w-10 text-center uppercase"
              class:text-primary={problem.scoreIndex === scoreIndex}
              class:font-bold={problem.scoreIndex === scoreIndex}
              class:border-l={scoreIndex < 1}
            >
              <span class:opacity-20={data.novice.eliminated[p].includes(competitor.name)}>
                {score > 0 ? score : ''}
              </span>
            </td>
          {/each}
        {/each}
      </tr>
    {/each}
    <tr><td colspan="22" class="border-b" /></tr>
    {#each data.inter.competitors as competitor, i}
      <tr>
        {#if i === 0}
          <td rowspan={data.inter.competitors.length} class="-rotate-90 text-center text-xl">
            Inter
          </td>
        {/if}
        <td>{competitor.name}</td>
        {#each competitor.problems as problem, p}
          {#each problem.scores as score, scoreIndex}
            <td
              class="w-10 text-center uppercase"
              class:text-primary={problem.scoreIndex === scoreIndex}
              class:font-bold={problem.scoreIndex === scoreIndex}
              class:border-l={scoreIndex < 1}
            >
              <span class:opacity-20={data.inter.eliminated[p].includes(competitor.name)}>
                {score > 0 ? score : ''}
              </span>
            </td>
          {/each}
        {/each}
      </tr>
    {/each}
    <tr><td colspan="22" class="border-b" /></tr>
    {#each data.open.competitors as competitor, i}
      <tr>
        {#if i === 0}
          <td rowspan={data.open.competitors.length} class="-rotate-90 text-center text-xl">
            Open
          </td>
        {/if}
        <td>{competitor.name}</td>
        {#each competitor.problems as problem, p}
          {#each problem.scores as score, scoreIndex}
            <td
              class="w-10 text-center uppercase"
              class:text-primary={problem.scoreIndex === scoreIndex}
              class:font-bold={problem.scoreIndex === scoreIndex}
              class:border-l={scoreIndex < 1}
            >
              <span class:opacity-20={data.open.eliminated[p].includes(competitor.name)}>
                {score > 0 ? score : ''}
              </span>
            </td>
          {/each}
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
