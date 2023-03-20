<script lang="ts">
  import { page } from '$app/stores'
  import supabase from '$lib/supabase'
  import Button from '$lib/ui/Button.svelte'

  const logout = () => supabase.auth.signOut()
</script>

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

{#if $page.data.session}
  <div
    class="bg-brand flex items-center justify-between border-y border-white p-5 text-3xl font-bold text-white"
  >
    JUDGE
    <Button class="text-sm" on:click={logout}>LOGOUT</Button>
  </div>
{/if}

<slot />
