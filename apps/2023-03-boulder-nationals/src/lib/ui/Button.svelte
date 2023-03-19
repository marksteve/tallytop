<script lang="ts">
  let extraClass = ''
  export { extraClass as class }
</script>

<button
  {...$$props}
  class={`border-brand rounded-xl border-4 bg-white p-2 text-xl font-bold ${extraClass}`}
  on:click
>
  <slot />
</button>
