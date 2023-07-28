<script lang="ts">
  import { page } from '$app/stores'
  import { env } from '$env/dynamic/public'
  import { synced } from '$lib/stores'
  import { stores } from '$lib/tinybase'
  import { HocuspocusProvider } from '@hocuspocus/provider'
  import { Loading } from 'carbon-components-svelte'
  import 'carbon-components-svelte/css/white.css'
  import { onDestroy } from 'svelte'

  const { ydoc } = $stores[$page.params.category]
  const provider = new HocuspocusProvider({
    url: env.PUBLIC_SYNC_URL,
    name: $page.params.category,
    document: ydoc,
    token: $page.data.token ?? 'public',
    onSynced() {
      synced.set(true)
    }
  })

  onDestroy(() => {
    if (provider) {
      provider.destroy()
    }
  })
</script>

<slot />

{#if !$synced}
  <Loading />
{/if}
