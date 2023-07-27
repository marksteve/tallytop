<script lang="ts">
  import { Button, Form, PasswordInput, Tile } from "carbon-components-svelte";
</script>

<div class="p-8">
  <Form class="max-w-sm flex flex-col gap-5" method="post">
    <PasswordInput
      name="password"
      labelText="Password"
      placeholder="Enter password"
    />
    <Button type="submit">Enter</Button>
  </Form>
</div>
