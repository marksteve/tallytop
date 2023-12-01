<script lang="ts">
  let extraClass = ''
  export { extraClass as class }

  let buttonClass = `px-5 leading-loose`

  export let rounded = true

  if (rounded) {
    buttonClass = `${buttonClass} rounded-full`
  }

  export let variant: 'none' | 'plain' = 'plain'
  switch (variant) {
    case 'none':
      break
    case 'plain':
    default:
      buttonClass = `${buttonClass} bg-stone-200 hover:bg-stone-300`
      break
  }
</script>

<button {...$$props} class={`${buttonClass} ${extraClass ?? ''}`} on:click>
  <slot />
</button>
