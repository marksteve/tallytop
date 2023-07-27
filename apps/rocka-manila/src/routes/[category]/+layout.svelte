<script lang="ts">
  import { page } from '$app/stores'
  import { env } from '$env/dynamic/public'
  import { stores } from '$lib/tinybase'
  import { HocuspocusProvider } from '@hocuspocus/provider'

  const { ydoc } = $stores[$page.params.category]

  new HocuspocusProvider({
    url: env.PUBLIC_SYNC_URL,
    name: $page.params.category,
    document: ydoc,
    token: 'public',
  })
</script>

<slot />
