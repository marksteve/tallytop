<script lang="ts">
  import '../app.css'

  import { invalidate } from '$app/navigation'
  import supabase from '$lib/supabase'
  import { onMount } from 'svelte'

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      invalidate('supabase:auth')
    })

    return () => {
      subscription.unsubscribe()
    }
  })
</script>

<svelte:head>
  <title>Tallytop</title>
</svelte:head>

<slot />
