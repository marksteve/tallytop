<script lang="ts">
  let className
  export { className as class }
</script>

<button
  {...$$props}
  class={`rounded-full bg-stone-200 px-5 leading-loose ${className ?? ''}`}
  on:click
>
  <slot />
</button>
