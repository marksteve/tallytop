<script lang="ts">
  import { enhance } from '$app/forms'
  import type { ActionData } from './$types'
  export let form: ActionData
</script>

<form method="POST" use:enhance>
  <div class="flex flex-col gap-10 p-10 text-4xl">
    <input
      type="email"
      name="email"
      placeholder="Email"
      class="p-5"
      value={form?.email ?? ''}
      readonly={form?.success}
      class:bg-roc-yellow={form?.success}
    />
    {#if form?.success}
      <div class="font-title text-center">Check your inbox</div>
    {:else}
      <button type="submit" class="font-title">Send magic link</button>
    {/if}
  </div>
</form>
