<script lang="ts">
  let links = [
    ['JUDGE', '/judge', 'rotate-3'],
    ['SEE SCORES', '/scores', '-rotate-2'],
    ['Sponsors', '/sponsors', 'rotate-1']
  ]
</script>

<div class="bg-roc-hotpink">
  <img src="/images/bg.jpg" class="fixed h-full w-full object-cover" />

  <div class="flex min-h-[80vh] items-center justify-center">
    <img src="/images/roc-royale-logo.png" class="relative" />
    <img src="/images/ccm-logo.png" class="relative" />
  </div>

  <div class="item-stretch relative flex h-[20vh] gap-10 p-10">
    {#each links as [link, href, _class]}
      <div class="flex flex-1">
        <a
          {href}
          class="bg-roc-black font-title hover:bg-roc-yellow hover:text-roc-black flex flex-1 items-center justify-center text-8xl text-white {_class}"
        >
          {link}
        </a>
      </div>
    {/each}
  </div>
</div>
