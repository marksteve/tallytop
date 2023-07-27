<script lang="ts">
  import { page } from '$app/stores'
  import { env } from '$env/dynamic/public'
  import { stores } from '$lib/tinybase'
  import { HocuspocusProvider } from '@hocuspocus/provider'

  let synced = false

  const { ydoc } = $stores[$page.params.category]

  new HocuspocusProvider({
    url: env.PUBLIC_SYNC_URL,
    name: $page.params.category,
    document: ydoc,
    token: 'public',
    onSynced() {
      synced = true
    },
  })
</script>

<slot />

{#if !synced}
  <div class="absolute inset-0 bg-rockamanila-bg/50 text-rockamanila-magenta text-9xl flex justify-center items-center sm:text-3xl">
    Loading&hellip;
  </div>
{/if}
