<script lang="ts">
  import { goto } from '$app/navigation'
  import '../../app.css'

  const handleSelectCategory = (e) => {
    const category = e.target.value
    goto(`/manage/${category}`)
  }
</script>

<svelte:head>
  <link rel="preload" as="image" href="/images/half-with-bolts.png" />
  <link rel="preload" as="image" href="/images/half.png" />
  <link rel="preload" as="image" href="/images/logo.png" />
  <link rel="preload" as="image" href="/images/quarter-with-bolts.png" />
  <link rel="preload" as="image" href="/images/slice.png" />
  <link rel="preload" as="image" href="/images/square.png" />
  <link rel="preload" as="image" href="/images/three-quarters-with-bolts.png" />
  <link rel="preload" as="image" href="/images/three-quarters.png" />
  <link rel="preload" as="image" href="/images/whole-with-bolt.png" />
  <link rel="preload" as="image" href="/images/whole.png" />
</svelte:head>

<div class="grid grid-cols-3 items-start gap-5 p-5">
  <h1 class="text-brand-red col-span-3 font-serif text-6xl">
    <img
      src="/images/logo.png"
      alt="Logo"
      class="inline-block w-24 align-middle"
    />
    Manage
    <select class="bg-transparent font-serif" on:change={handleSelectCategory}>
      <option value="open-m">Open Men's</option>
      <option value="open-w">Open Women's</option>
      <option value="teams">Teams</option>
    </select>
  </h1>
  <slot />
</div>
