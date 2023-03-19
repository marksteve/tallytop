<script lang="ts">
  import { page } from '$app/stores'
  import supabase from '$lib/supabase'

  const logout = () => supabase.auth.signOut()
</script>

{#if $page.data.session}
  Logged in as {$page.data.session?.user.email}
  <button on:click={logout}>Logout</button>
{/if}

<div class="text-brand flex items-center justify-between p-5">
  <a class="w-32" href="/">
    <img src="/images/logo.svg" class="w-full" />
  </a>
  <h2 class="text-3xl font-bold">{$page.data.title}</h2>
</div>

<slot />
