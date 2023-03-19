<script lang="ts">
  import { page } from '$app/stores'
  import supabase from '$lib/supabase'

  const logout = () => supabase.auth.signOut()
</script>

{#if $page.data.session}
  Logged in as {$page.data.session?.user.email}
  <button on:click={logout}>Logout</button>
{/if}

<div class="text-brand flex justify-between p-5">
  <a class="w-32" href="/">
    <img src="/images/logo.svg" class="w-full" />
  </a>
  <div class="relative flex items-center">
    <img class="absolute h-full" src="/images/header-bg.svg" />
    <h2 class="relative bg-white text-3xl font-bold">
      {$page.data.title}
    </h2>
  </div>
</div>

<slot />
