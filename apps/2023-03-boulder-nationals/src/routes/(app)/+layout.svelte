<script lang="ts">
  import { afterNavigate, beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import supabase from '$lib/supabase'
  import Button from '$lib/ui/Button.svelte'
  import ProgressBar from 'svelte-progress-bar'
  import headerBg from './header-bg.svg'
  import logo from './logo.svg'

  const logout = () => supabase.auth.signOut()

  let progress
  beforeNavigate((navigation) => {
    if (
      navigation.from?.route.id !== '/(app)/judge/[round]/[category]/[problem_id]/[competitor_id]'
    ) {
      progress.start()
    }
  })
  afterNavigate(() => progress.complete())
</script>

<div class="flex min-h-screen flex-col">
  <ProgressBar bind:this={progress} color="#003070" class="fixed inset-x-0 top-0" />
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
