<script lang="ts">
  import { page } from '$app/stores'
  import { env } from '$env/dynamic/public'
  import { synced } from '$lib/stores'
  import { stores } from '$lib/tinybase'
  import { HocuspocusProvider } from '@hocuspocus/provider'
  import { onDestroy } from 'svelte'

  let provider: HocuspocusProvider

  const { ydoc } = $stores[$page.params.category]

  provider = new HocuspocusProvider({
    url: env.PUBLIC_SYNC_URL,
    name: $page.params.category,
    document: ydoc,
    token: 'public',
    onSynced() {
      synced.set(true)
    },
  })
  
  onDestroy(() => {
    if (provider) {
      provider.destroy()
    }
  })
</script>

<slot />

{#if !$synced}
  <div class="absolute inset-0 bg-rockamanila-bg/90 flex justify-center items-center">
    <img src="/images/sun.svg" class="animate-[spin_3s_linear_infinite] w-40" alt="Sun" />
  </div>
{/if}
