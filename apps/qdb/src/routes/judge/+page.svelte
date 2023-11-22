<script lang="ts">
  import { list, listItem } from '$lib/variants'
</script>

<div class={list()}>
  <a href="./judge/teams" class={listItem({ class: 'font-tanker text-3xl' })}>
    teams
  </a>
  <a href="./judge/open" class={listItem({ class: 'font-tanker text-3xl' })}>
    open
  </a>
</div>
