<script lang="ts">
  import { Button } from '@tallytop/ui'
</script>

<form action="/api/login" class="font-tanker" method="post">
  <div class="flex flex-col gap-2 p-2">
    <input
      name="auth"
      type="password"
      class="font-tanker border border-current text-center leading-10"
      placeholder="password"
    />
    <Button type="submit">login</Button>
  </div>
</form>
