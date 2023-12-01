<script lang="ts">
  import Logo from '$lib/components/Logo.svelte'
</script>

<main class="flex flex-col items-center gap-5 p-5">
  <slot />
  <div class="flex flex-col items-center gap-1 text-xs">
    Scoring platform by <Logo />
  </div>
</main>
