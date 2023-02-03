<script lang="ts">
  import { Wordmark } from '@tallytop/ui'
  let links = [
    ['SEE SCORES', '/scores', '-rotate-2'],
    ['JUDGE', '/judge', 'rotate-3'],
    ['Sponsors', '/sponsors', 'rotate-1']
  ]
</script>

<div class="bg-roc-hotpink">
  <img src="/images/bg.jpg" class="fixed h-full w-full object-cover" />

  <div class="flex items-center p-10 md:max-h-[60vh] md:justify-center">
    <img src="/images/roc-royale-logo.png" class="relative flex-1 md:flex-none" />
    <img src="/images/ccm-logo.png" class="relative flex-1 md:flex-none" />
  </div>

  <div class="relative flex flex-col gap-10 p-10 md:flex-row">
    {#each links as [link, href, _class]}
      <div class="flex flex-1">
        <a
          {href}
          class="bg-roc-black font-title hover:bg-roc-yellow hover:text-roc-black flex flex-1 items-center justify-center text-8xl text-white {_class} -indent-5 leading-[0.8em]"
        >
          {link}
        </a>
      </div>
    {/each}
  </div>

  <div class="relative flex items-center justify-center gap-2 whitespace-nowrap p-10 text-2xl">
    Powered by
    <Wordmark class="h-14" />
  </div>
</div>
