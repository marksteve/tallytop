<script lang="ts">
  import { list, listItem } from '$lib/variants'
</script>

<div class={list()}>
  <a href="./open-m/qualis" class={listItem({ class: 'font-tanker text-3xl' })}>
    qualis
  </a>
  <a href="./open-m/finals" class={listItem({ class: 'font-tanker text-3xl' })}>
    finals
  </a>
</div>
