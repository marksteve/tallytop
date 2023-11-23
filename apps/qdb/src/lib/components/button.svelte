<button
  {...$$props}
  class={`bg-brand-green rounded-full border-current px-2 text-sm uppercase leading-loose text-white ${
    $$props.class ?? ''
  }`}
  on:click
>
  <slot />
</button>
