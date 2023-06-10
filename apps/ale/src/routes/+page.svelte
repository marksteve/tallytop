<script>
  const remaining = new Date(2023, 6, 15).getTime() - Date.now()
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
</script>

<div class="flex flex-1 items-center justify-center">
  <div class="text-center uppercase leading-loose">
    <div class="text-9xl">{days}</div>
    <div class="text-3xl">days to go!</div>
  </div>
</div>
