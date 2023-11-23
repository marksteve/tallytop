<script lang="ts">
  import { button, type ButtonProps } from './variants.js'

  export let variant: ButtonProps['variant'] = null
</script>

<button
  {...$$props}
  on:click
  class={button({ variant, class: $$props.class, disabled: $$props.disabled })}
>
  <slot />
</button>
