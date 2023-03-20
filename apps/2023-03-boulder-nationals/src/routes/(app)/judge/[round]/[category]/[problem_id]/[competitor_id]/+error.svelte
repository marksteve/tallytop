<script lang="ts">
  import { page } from '$app/stores'
</script>

<div class="flex p-10 text-center text-xl text-white">{$page.error?.message}</div>
