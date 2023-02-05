<script>
  import { browser } from '$app/environment'
  import { Logo, Timer } from '@tallytop/ui'
  import { timerQueue } from '$lib/stores'

  const [duration, description] = $timerQueue[0]
</script>

<div class="flex min-h-screen flex-1 flex-col items-center justify-center gap-10">
  <Logo width="128" />
  <Timer {duration} {browser} />
  <div class="text-2xl">{description}</div>
</div>
