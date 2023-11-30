<script lang="ts">
  import { page } from '$app/stores'
  import { variants } from '@tallytop/ui'

  const count = {
    qualis: 5,
    finals: 4,
  }[$page.params.round]

  const problems = [...Array(count).keys()].map((i) => i + 1)
</script>

<div class={variants.list()}>
  {#each problems as problem}
    <a
      href={`./${$page.params.round}/problem:${problem}`}
      class={variants.listItem({ class: 'text-3xl' })}
    >
      {$page.params.category}{problem}
    </a>
  {/each}
</div>
