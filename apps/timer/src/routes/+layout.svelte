<script>
  import '../app.css'
</script>

<svelte:head>
  <title>Tallytop Timer</title>
  <link rel="preload" as="image" href="/images/tallytop.svg" />
  <link rel="preload" as="audio" href="/sounds/beep.mp3" />
  <link rel="preload" as="audio" href="/sounds/end.mp3" />
</svelte:head>

<slot />

<img src="/images/tallytop.svg" class="fixed bottom-5 right-5 w-40 pointer-events-none" alt="Tallytop" />
