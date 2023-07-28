<script lang="ts">
  import { page } from '$app/stores'
  import { env } from '$env/dynamic/public'
  import { stores } from '$lib/tinybase'
  import { HocuspocusProvider } from '@hocuspocus/provider'
  import { Button, Loading } from 'carbon-components-svelte'
  import 'carbon-components-svelte/css/white.css'
    import { onDestroy } from 'svelte'

  let synced = false
  let provider: HocuspocusProvider

  $: ydoc = ($stores[$page.params.category] ?? {}).ydoc

  $: if (ydoc) {
    provider = new HocuspocusProvider({
      url: env.PUBLIC_SYNC_URL,
      name: $page.params.category,
      document: ydoc,
      token: $page.data.token ?? 'public',
      onSynced() {
        synced = true
      }
    })
  }

  onDestroy(() => {
    if (provider) {
      provider.destroy()
    }
  })
</script>

<h1
  class="text-2xl font-bold px-8 border-b border-solid leading-loose flex justify-between items-center"
>
  <a href="/admin" class="text-current">Tallytop</a>
  {#if $page.data.token}
    <a href="/logout" class="leading-none"><Button kind="tertiary" size="small">Logout</Button></a>
  {/if}
</h1>

<slot />

{#if !synced}
  <Loading />
{/if}
