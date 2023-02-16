<script lang="ts">
  import { Logo } from '@tallytop/ui'
  let links = [
    ['SCORES', '/scores', '-rotate-2'],
    ['JUDGE', '/judge', 'rotate-3'],
    ['Sponsors', '/sponsors', 'rotate-1']
  ]
</script>

<div class="flex flex-col items-center p-10 md:max-h-[70vh] md:flex-row md:justify-center">
  <img src="/images/roc-royale-logo.png" class="w-3/4 md:w-auto md:flex-none" alt="Roc Royale" />
  <img src="/images/ccm-logo.png" class="w-3/4 md:w-auto md:flex-none" alt="CCM" />
</div>

<div class="flex flex-col items-center gap-10 p-10 md:flex-row">
  {#each links as [link, href, _class]}
    <div class="flex md:flex-1">
      <a
        {href}
        class="bg-roc-yellow font-title hover:bg-roc-black hover:text-white text-roc-black ml-5 flex-1 -indent-5 text-8xl leading-[0.8em] {_class}"
      >
        {link}
      </a>
    </div>
  {/each}
</div>

<div class="flex items-center justify-center gap-2 whitespace-nowrap p-10 text-2xl">
  Scoring by
  <Logo class="h-8" />
  <span class="font-black">Tallytop</span>
</div>
