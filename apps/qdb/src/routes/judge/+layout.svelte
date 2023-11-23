<script lang="ts">
  import { page } from '$app/stores'
  import '../../tallytop.css'
</script>

<svelte:head>
  <meta name="apple-mobile-web-app-capable" content="yes" />
</svelte:head>

<div
  class="absolute inset-0 grid min-h-screen grid-rows-[min-content_1fr] bg-slate-100 text-slate-900"
>
  <div class="font-tanker z-10 flex flex-wrap bg-white shadow-lg">
    <div class="w-full p-2 text-center text-lg">tallytop</div>
    {#each $page.data.menu as item}
      <a
        href={`/${item.path.join('/')}`}
        class="flex-1 border-t border-current p-2 text-center text-lg"
      >
        {item.label}
      </a>
    {/each}
  </div>
  <div class="overflow-y-auto">
    <slot />
  </div>
</div>
