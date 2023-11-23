<script lang="ts">
  import Playground from '$lib/components/playground.svelte'
  import Star from '$lib/components/star.svelte'
</script>

<Playground />

<main class="relative flex h-screen w-screen items-center justify-center">
  <div
    class="text-brand-red border-brand-red bg-brand-peach/90 rounded-tl-full rounded-tr-full border p-10 text-center"
  >
    <div class="text-4xl md:text-6xl">2023</div>
    <div class="font-serif text-6xl md:text-8xl">
      Queso de
      <br />
      Boulder
    </div>
    <div class="py-5 text-4xl md:text-6xl">
      <Star />
      a bhive
      <Star />
      <br />
      pamaskomp
    </div>
  </div>
</main>
