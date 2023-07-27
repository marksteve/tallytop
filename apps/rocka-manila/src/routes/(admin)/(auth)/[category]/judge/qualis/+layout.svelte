<script lang="ts">
  import { page } from '$app/stores'
  import { Button } from "carbon-components-svelte"
</script>

<slot />

<div class="fixed inset-0 pointer-events-none">
  <div class="absolute bottom-5 right-5 pointer-events-auto">
    <a href={`/${$page.params.category}/results/qualis`}>
      <Button>Results &rarr;</Button>
    </a>
  </div>
</div>
