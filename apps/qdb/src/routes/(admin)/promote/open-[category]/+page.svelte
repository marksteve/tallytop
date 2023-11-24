<script lang="ts">
  import { page } from '$app/stores'
  import { variants } from '@tallytop/ui'
  variants
</script>

<div class={variants.list()}>
  <a
    href={`./open-${$page.params.category}/qualis`}
    class={variants.listItem({ class: 'font-tanker text-3xl' })}
  >
    qualis
  </a>
  <a
    href={`./open-${$page.params.category}/finals`}
    class={variants.listItem({ class: 'font-tanker text-3xl' })}
  >
    finals
  </a>
</div>
