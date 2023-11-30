<script lang="ts">
  import { variants } from '@tallytop/ui'
</script>

<div class={variants.list()}>
  <a
    href="./admin/judge"
    class={variants.listItem({ class: 'text-3xl' })}
  >
    judge
  </a>
  <a
    href="./admin/promote"
    class={variants.listItem({ class: 'text-3xl' })}
  >
    promote
  </a>
</div>
