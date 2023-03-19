<script lang="ts">
  import { page } from '$app/stores'
  import supabase from '$lib/supabase'
  import Button from '$lib/ui/Button.svelte'

  const logout = () => supabase.auth.signOut()
</script>

{#if $page.data.session}
  JUDGE MODE
  <Button on:click={logout}>LOGOUT</Button>
{/if}

<div class="text-brand flex justify-between p-5">
  <a class="flex-1" href="/">
    <img src="/images/logo.svg" class="w-32" />
  </a>
  <div class="relative flex flex-1 items-center justify-end">
    <img class="absolute h-full w-full object-contain object-right" src="/images/header-bg.svg" />
    <h2 class="relative bg-white text-3xl font-bold">
      {$page.data.title}
    </h2>
  </div>
</div>

<slot />
