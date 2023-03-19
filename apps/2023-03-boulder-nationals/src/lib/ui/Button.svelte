<script lang="ts">
  let extraClass = ''
  export { extraClass as class }
</script>

<button
  {...$$props}
  class={`border-brand hover:bg-brand text-brand rounded-xl border-4 bg-white p-2 text-xl font-bold hover:text-white ${extraClass}`}
  on:click
>
  <slot />
</button>
