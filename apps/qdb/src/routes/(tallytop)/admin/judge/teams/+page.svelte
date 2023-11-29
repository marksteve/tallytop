<script lang="ts">
  import { variants } from '@tallytop/ui'

  const problems = [...Array(6).keys()].map((i) => i + 1)
</script>

<div class={variants.list()}>
  {#each problems as problem}
    <a
      href={`./teams/problem:${problem}`}
      class={variants.listItem({ class: 'font-tanker text-3xl' })}
    >
      problem {problem}
    </a>
  {/each}
</div>
