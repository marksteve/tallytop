<script lang="ts">
  import { page } from '$app/stores'
  import { Logo } from '@tallytop/ui'

  const [titleText, titleClass] = $page.data.title
</script>

<div class="flex flex-col gap-5">
  <div class="flex items-center justify-between gap-5 p-5">
    <a href="/" class="w-1/4">
      <img src="/images/roc-royale-logo.png" alt="Roc Royale" />
    </a>
    <h2
      class="bg-roc-black font-title hover:bg-roc-yellow hover:text-roc-black text-6xl leading-[0.8em] text-white {titleClass}"
    >
      {titleText}
    </h2>
    <div class="w-1/4">
      <img src="/images/ccm-logo.png" alt="CCM" />
    </div>
  </div>

  <slot />

  <div class="flex items-center justify-center gap-2 whitespace-nowrap p-10 text-2xl">
    Scoring by
    <Logo class="h-8" />
    <span class="font-black">Tallytop</span>
  </div>
</div>
