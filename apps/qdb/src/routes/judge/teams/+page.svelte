<script lang="ts">
  import { list, listItem } from '$lib/variants'

  const problems = [...Array(6).keys()].map((i) => i + 1)
</script>

<div class={list()}>
  {#each problems as problem}
    <a
      href={`/judge/teams/problem:${problem}`}
      class={listItem({ class: 'font-tanker text-3xl' })}
    >
      Problem {problem}
    </a>
  {/each}
</div>
