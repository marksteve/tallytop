<script lang="ts">
  import 'app.css'
</script>

<slot />

<style>
  :global(body) {
    background-image: url(/pattern.svg);
    background-position: center;
    @apply bg-brand-peach;
  }
</style>
