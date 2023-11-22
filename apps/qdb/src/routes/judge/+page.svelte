<script lang="ts">
  import { list, listItem } from '$lib/variants'
</script>

<div class={list()}>
  <a href="./judge/open-m" class={listItem({ class: 'font-tanker text-3xl' })}>
    open mens
  </a>
  <a href="./judge/open-w" class={listItem({ class: 'font-tanker text-3xl' })}>
    open womens
  </a>
  <a href="./judge/teams" class={listItem({ class: 'font-tanker text-3xl' })}>
    teams
  </a>
</div>
