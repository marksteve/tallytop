<script lang="ts">
  import { variants } from '@tallytop/ui'
</script>

<div class={variants.list()}>
  <a
    href="./judge"
    class={variants.listItem({ class: 'font-tanker text-3xl' })}
  >
    judge
  </a>
  <a
    href="./promote"
    class={variants.listItem({ class: 'font-tanker text-3xl' })}
  >
    promote
  </a>
</div>
