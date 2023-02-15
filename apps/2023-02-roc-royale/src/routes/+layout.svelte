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
  <title>ROC ROYALE</title>
</svelte:head>

<div class="bg-roc-hotpink">
  <img src="/images/bg.jpg" class="fixed h-full w-full object-cover" alt="Background" />
  <div class="relative">
    <slot />
  </div>
</div>
