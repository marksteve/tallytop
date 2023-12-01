<script lang="ts">
  import { page } from '$app/stores'
  import Scores from '$lib/components/Scores.svelte'
  import Star from '$lib/components/Star.svelte'

  const { r } = $page.data
</script>

<div class="flex items-center gap-5 self-start">
  <div class="text-brand-red font-serif text-6xl">Open</div>
  <div
    class="border-brand-red bg-brand-red text-brand-peach flex items-center gap-1 rounded-full border px-2 uppercase leading-8"
  >
    <Star class="text-brand-yellow text-lg" />
    Finals
    <Star class="text-brand-yellow text-lg" />
  </div>
</div>

<div class="grid grid-cols-2 gap-5 self-stretch">
  <div class="text-brand-red font-serif text-3xl">Men's</div>
  <div class="text-brand-red font-serif text-3xl">Women's</div>
  <div class="flex flex-col gap-5">
    <Scores {r} category="open-m" round="finals" />
  </div>
  <div class="flex flex-col gap-5">
    <Scores {r} category="open-w" round="finals" />
  </div>
</div>
