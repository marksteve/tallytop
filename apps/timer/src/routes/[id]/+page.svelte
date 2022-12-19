<script lang="ts">
  import Timer from '$lib/components/Timer.svelte'
  import type { PageData } from './$types'
  export let data: PageData
</script>

<div class="flex min-h-screen flex-1 flex-col items-center justify-center gap-10">
  <img src="/images/logo.svg" width={128} alt="Logo" />
  <Timer id={data.id} viewMode />
</div>
