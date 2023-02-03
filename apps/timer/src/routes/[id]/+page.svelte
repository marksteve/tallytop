<script lang="ts">
  import { browser } from '$app/environment'
  import { Logo, Timer } from '@tallytop/ui'
  import type { PageData } from './$types'
  export let data: PageData
</script>

<div class="flex min-h-screen flex-1 flex-col items-center justify-center gap-10">
  <Logo width="128" />
  <Timer id={data.id} {browser} viewMode />
</div>
