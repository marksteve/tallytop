<script lang="ts">
  export let mono = false
</script>

<div
  class="flex h-20 w-20 items-center justify-center rounded-full border border-current font-serif text-3xl"
  class:text-brand-red={!mono}
  class:bg-brand-peach={!mono}
>
  Tallytop
</div>
