<script>
  import Playground from '$lib/components/playground.svelte'
  import Star from '$lib/components/star.svelte'
</script>

<Playground />

<main
  class="relative flex h-screen w-screen flex-col items-center justify-center gap-4"
>
  <div
    class="text-brand-red bg-brand-peach rounded-tl-full rounded-tr-full border border-current p-4 text-center"
  >
    <div class="text-xl">2023</div>
    <div class="font-serif text-4xl">
      Queso de
      <br />
      Boulder
    </div>
    <div class="py-2 text-2xl">
      <Star />
      a bhive
      <Star />
      <br />
      pamaskomp
    </div>
  </div>
  <div
    class="bg-brand-peach text-brand-red relative rounded-full border border-current leading-10"
  >
    <Star class="-translate-x-1/2" />
    <a href="/open-m/qualis" class="px-4">👱‍♂️ open men's</a>
    <Star class="translate-x-1/2" />
  </div>
  <div
    class="bg-brand-peach text-brand-red relative rounded-full border border-current leading-10"
  >
    <Star class="-translate-x-1/2" />
    <a href="/open-w/qualis" class="px-4">👩 open women's</a>
    <Star class="translate-x-1/2" />
  </div>
  <div
    class="bg-brand-peach text-brand-red relative rounded-full border border-current leading-10"
  >
    <Star class="-translate-x-1/2" />
    <a href="/teams" class="px-4">👪 teams</a>
    <Star class="translate-x-1/2" />
  </div>
</main>
