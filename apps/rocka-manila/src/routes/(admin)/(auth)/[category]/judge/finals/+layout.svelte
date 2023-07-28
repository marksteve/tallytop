<script lang="ts">
  import { page } from '$app/stores'
  import { synced } from '$lib/stores'
  import { stores } from '$lib/tinybase'
  import { Button, Toggle } from 'carbon-components-svelte'
  import { onDestroy, onMount } from 'svelte'

  const { store } = $stores[$page.params.category]

  $: settingsId = `${$page.params.category}:finals`

  let completed = false
  $: if ($synced) {
    const settings = store.getTable('settings')
    completed = settings[settingsId]?.completed ?? false
  }

  let listeners: string[]
  onMount(() => {
    listeners = [
      store.addTableListener('settings', () => {
        const settings = store.getTable('settings')
        completed = settings[settingsId]?.completed ?? false
      }),
    ]
  })
  onDestroy(() => {
    listeners.forEach((listenerId) => store.delListener(listenerId))
  })

  $: if ($synced) {
    store.setRow('settings', settingsId, { completed })
  } 
</script>

<slot />

<div class="fixed inset-0 pointer-events-none">
  <div class="absolute bottom-5 right-5 pointer-events-auto">
    <a href={`/${$page.params.category}/results/finals`}>
      <Button>Results &rarr;</Button>
    </a>
    <Toggle labelA="Ongoing" labelB="Completed" bind:toggled={completed} />
  </div>
</div>
