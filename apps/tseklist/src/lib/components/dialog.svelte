<script lang="ts">
  import { createDialog, melt } from '@melt-ui/svelte'

  const {
    elements: {
      trigger,
      portalled,
      overlay,
      content,
      title,
      close,
    },
    states: { open },
  } = createDialog()
</script>

<button use:melt={$trigger}><slot name="trigger" /></button>

<div use:melt={$portalled}>
  {#if $open}
    <div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
    <div
      use:melt={$content}
      class="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white p-6"
    >
      <h2 use:melt={$title} class="text-3xl"><slot name="title" /></h2>
      <slot />
      <button use:melt={$close}><slot name="close" /></button>
    </div>
  {/if}
</div>
