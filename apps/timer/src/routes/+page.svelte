<script>
  import { browser } from '$app/environment'
  import { Logo, Timer } from '@tallytop/ui'
</script>

<div class="flex min-h-screen flex-1 flex-col items-center justify-center gap-10">
  <Logo width="128" />
  <Timer {browser} />
</div>
