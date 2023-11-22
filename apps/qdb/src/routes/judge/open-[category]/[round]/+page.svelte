<script lang="ts">
  import { page } from '$app/stores'
  import { list, listItem } from '$lib/variants'

  const count = {
    qualis: 5,
    finals: 4,
  }[$page.params.round]

  const problems = [...Array(count).keys()].map((i) => i + 1)
</script>

<div class={list()}>
  {#each problems as problem}
    <a
      href={`./${$page.params.round}/problem:${problem}`}
      class={listItem({ class: 'font-tanker text-3xl' })}
    >
      {$page.params.category}{problem}
    </a>
  {/each}
</div>
