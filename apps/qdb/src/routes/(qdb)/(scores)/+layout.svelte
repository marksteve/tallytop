<script lang="ts">
  import Logo from '$lib/components/Logo.svelte'
</script>

<main class="flex flex-col items-center gap-5 p-5">
  <div class="flex items-center gap-5">
    <a href="/"><img src="/images/logo.png" class="h-20" alt="QDB Logo" /></a>
    <img src="/images/bhive.svg" class="h-20" alt="BHive Logo" />
  </div>
  <slot />
  <div class="flex flex-col items-center gap-1 text-xs">
    Scoring platform by <Logo />
  </div>
</main>
