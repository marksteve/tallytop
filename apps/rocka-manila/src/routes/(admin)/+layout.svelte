<script lang="ts">
  import { page } from '$app/stores'
  import { Button } from 'carbon-components-svelte'
  import 'carbon-components-svelte/css/white.css'
</script>

<h1
  class="text-2xl font-bold px-8 border-b border-solid leading-loose flex justify-between items-center"
>
  <a href="/admin" class="text-current">Tallytop</a>
  {#if $page.data.token}
    <a href="/logout" class="leading-none"><Button kind="tertiary" size="small">Logout</Button></a>
  {/if}
</h1>

<slot />
