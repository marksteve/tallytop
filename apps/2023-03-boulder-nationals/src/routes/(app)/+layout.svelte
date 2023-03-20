<script lang="ts">
  import { page } from '$app/stores'
  import supabase from '$lib/supabase'
  import Button from '$lib/ui/Button.svelte'
  import headerBg from './header-bg.svg'
  import logo from './logo.svg'

  const logout = () => supabase.auth.signOut()
</script>

<div class="flex min-h-screen flex-col">
  <div class="text-brand flex justify-between gap-5 p-5">
    <a class="flex-1" href="/">
      <img src={logo} class="w-32" />
    </a>
    <div class="relative flex flex-1 items-center justify-end gap-2">
      <img class="absolute h-full w-full object-contain object-right" src={headerBg} />
      <h2 class="relative bg-white text-xl font-bold">
        {$page.data.title ?? ''}
      </h2>
      {#if $page.data.session}
        <Button class="relative p-2 text-sm" on:click={logout}>LOGOUT</Button>
      {/if}
    </div>
  </div>

  <slot />
</div>
