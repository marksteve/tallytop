<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  let category: string = $page.url.pathname.split('/')[3]

  const handleSelectCategory = (e) => {
    category = e.target.value
    goto(`/admin/manage/${category}`)
  }
</script>

<div class="grid grid-cols-3 items-start gap-5 p-5">
  <h1 class="text-brand-red col-span-3 font-serif text-6xl">
    <img
      src="/images/logo.png"
      alt="Logo"
      class="inline-block w-24 align-middle"
    />
    Manage
    <select
      class="bg-transparent font-serif"
      on:change={handleSelectCategory}
      bind:value={category}
    >
      <option value="open-m">Open Men's</option>
      <option value="open-w">Open Women's</option>
      <option value="teams">Teams</option>
    </select>
  </h1>
  <slot />
</div>
