<script lang="ts">
  import { page } from '$app/stores'
  import supabase from '$lib/supabase'

  const logout = () => supabase.auth.signOut()
</script>

{#if $page.data.session}
  Logged in as {$page.data.session?.user.email}
  <button on:click={logout}>Logout</button>
{/if}

<slot />