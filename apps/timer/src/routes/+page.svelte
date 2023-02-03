<script>
  import { browser } from '$app/environment'
  import { Timer } from '@tallytop/ui'
</script>

<div class="flex min-h-screen flex-1 flex-col items-center justify-center gap-10">
  <img src="/images/logo.svg" width={128} alt="Logo" />
  <Timer {browser} />
</div>
