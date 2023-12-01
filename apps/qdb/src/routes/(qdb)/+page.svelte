<script>
  import Playground from '$lib/components/Playground.svelte'
  import Star from '$lib/components/Star.svelte'
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

<Playground />

<main
  class="relative flex h-screen w-screen flex-col items-center justify-center gap-4"
>
  <div
    class="text-brand-red bg-brand-peach relative rounded-tl-full rounded-tr-full border border-current p-6 text-center"
  >
    <div class="text-3xl">2023</div>
    <div class="font-serif text-6xl">
      Queso de
      <br />
      Boulder
    </div>
    <div class="py-3 text-3xl">
      <Star />
      a bhive
      <Star />
      <br />
      pamaskomp
    </div>

    <img
      src="/images/bhive.svg"
      alt="BHive Logo"
      class="absolute left-full top-1/2 h-20 -translate-x-1/2 rotate-12"
    />
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
