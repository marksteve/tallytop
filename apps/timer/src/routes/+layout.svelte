<script>
  import '../app.css'
</script>

<svelte:head>
  <title>Tallytop Timer</title>
  <link rel="preload" as="image" href="/images/play.png" />
  <link rel="preload" as="image" href="/images/stop.png" />
  <link rel="preload" as="image" href="/images/reset.png" />
  <link rel="preload" as="audio" href="/sounds/ooh-wee.mp3" />
  <link rel="preload" as="audio" href="/sounds/makeba.mp3" />
</svelte:head>

<slot />
