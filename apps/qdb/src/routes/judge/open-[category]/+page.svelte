<script lang="ts">
  import { variants } from '@tallytop/ui'
  variants
</script>

<div class={variants.list()}>
  <a
    href="./open-m/qualis"
    class={variants.listItem({ class: 'font-tanker text-3xl' })}
  >
    qualis
  </a>
  <a
    href="./open-m/finals"
    class={variants.listItem({ class: 'font-tanker text-3xl' })}
  >
    finals
  </a>
</div>
