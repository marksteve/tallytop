<script lang="ts">
  import 'app.css'
</script>

<svelte:head>
  <link rel="preload" as="image" href="/images/half-with-bolts.png" />
  <link rel="preload" as="image" href="/images/half.png" />
  <link rel="preload" as="image" href="/images/logo.png" />
  <link rel="preload" as="image" href="/images/quarter-with-bolts.png" />
  <link rel="preload" as="image" href="/images/slice.png" />
  <link rel="preload" as="image" href="/images/square.png" />
  <link rel="preload" as="image" href="/images/three-quarters-with-bolts.png" />
  <link rel="preload" as="image" href="/images/three-quarters.png" />
  <link rel="preload" as="image" href="/images/whole-with-bolt.png" />
  <link rel="preload" as="image" href="/images/whole.png" />
</svelte:head>

<slot />

<style>
  :global(body) {
    background-image: url(/pattern.svg);
    background-position: center;
    @apply bg-brand-peach;
  }
</style>
