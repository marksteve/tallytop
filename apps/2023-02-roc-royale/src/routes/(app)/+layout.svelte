<script lang="ts">
  import { page } from '$app/stores'
  import { Logo } from '@tallytop/ui'

  let titleText = ''
  let titleClass = ''
  $: [titleText, titleClass] = $page.data.title
</script>

<div class="flex min-h-screen flex-col gap-5">
  <div class="flex h-32 items-center justify-between gap-5 px-5">
    <a href="/" class="w-1/5 flex-none">
      <img src="/images/roc-royale-logo.png" alt="Roc Royale" />
    </a>
    <h2
      class="bg-roc-black font-title ml-5 -indent-5 text-6xl leading-[0.8em] text-white {titleClass} text-center"
    >
      {titleText}
    </h2>
    <div class="w-1/5 flex-none">
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
