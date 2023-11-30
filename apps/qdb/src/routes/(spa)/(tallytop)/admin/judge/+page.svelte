<script lang="ts">
  import { variants } from '@tallytop/ui'
</script>

<div class={variants.list()}>
  <a
    href="./judge/open-m"
    class={variants.listItem({ class: 'text-3xl' })}
  >
    open men's
  </a>
  <a
    href="./judge/open-w"
    class={variants.listItem({ class: 'text-3xl' })}
  >
    open women's
  </a>
  <a
    href="./judge/teams"
    class={variants.listItem({ class: 'text-3xl' })}
  >
    teams
  </a>
</div>
