<script lang="ts">
  import { enhance } from '$app/forms'
  import Button from '$lib/ui/Button.svelte'
  import type { ActionData } from './$types'

  export let form: ActionData
</script>

<form method="POST" use:enhance>
  <div class="flex flex-col gap-5 p-5 text-3xl">
    <input
      class="border-brand rounded-xl border-4 p-2 text-center placeholder:text-center"
      name="password"
      type="password"
      placeholder="PASSWORD"
    />
    <Button type="submit">LOGIN</Button>
    {#if form?.error}
      <div class="text-center text-red-500">{form.error}</div>
    {/if}
  </div>
</form>
