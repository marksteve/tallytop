<script lang="ts">
  import { page } from '$app/stores'
  import { stores } from '$lib/tinybase'
  import { Button, Toggle } from 'carbon-components-svelte'
  import { onDestroy, onMount } from 'svelte'

  const { store } = $stores[$page.params.category]

  let completed = false

  let listeners: string[]
  onMount(() => {
    listeners = [
      store.addTableListener('settings', () => {
        const settings = store.getTable('settings')
        completed = settings[$page.params.category]
      }),
    ]
  })
  onDestroy(() => {
    listeners.forEach((listenerId) => store.delListener(listenerId))
  })

  $: {
    store.setRow('settings', $page.params.category, { completed })
  } 

</script>

<slot />

<div class="fixed inset-0 pointer-events-none">
  <div class="absolute bottom-5 right-5 pointer-events-auto">
    <a href={`/${$page.params.category}/results/qualis`}>
      <Button>Results &rarr;</Button>
    </a>
    <Toggle labelA="Ongoing" labelB="Completed" bind:toggled={completed} />
  </div>
</div>
