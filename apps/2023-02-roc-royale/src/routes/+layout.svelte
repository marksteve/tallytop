<script>
  import '../app.css'
</script>

<svelte:head>
  <title>ROC ROYALE</title>
</svelte:head>

<div class="bg-roc-hotpink">
  <img src="/images/bg.jpg" class="fixed h-full w-full object-cover" alt="Background" />
  <div class="relative">
    <slot />
  </div>
</div>
