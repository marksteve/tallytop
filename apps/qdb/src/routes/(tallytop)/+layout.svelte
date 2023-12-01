<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import '../../tallytop.css'

  let height = 0
  onMount(() => {
    height = window.innerHeight
  })
</script>

<svelte:head>
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <link rel="preload" as="image" href="/attempt.svg" />
  <link rel="preload" as="image" href="/zone.svg" />
  <link rel="preload" as="image" href="/top.svg" />
</svelte:head>

<div
  class="font-tanker absolute inset-0 grid grid-rows-[min-content_1fr] bg-slate-100 text-slate-900"
  style={`height: ${height}px`}
>
  <div class="z-10 flex flex-wrap bg-white shadow-lg">
    <div class="w-full p-2 text-center text-lg">
      <a href="/admin">tallytop</a>
    </div>
    {#each $page.data.menu as item}
      <a
        href={`/${item.path.join('/')}`}
        class="flex-1 whitespace-nowrap border-t border-current p-2 text-center text-lg"
      >
        {item.label}
      </a>
    {/each}
  </div>
  <div class="overflow-y-auto">
    <slot />
  </div>
</div>
