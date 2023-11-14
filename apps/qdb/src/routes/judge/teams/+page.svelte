<script lang="ts">
  import Button from '$lib/components/button.svelte'
  import { Splide, SplideSlide } from '@splidejs/svelte-splide'
  import type { SplideEvents } from '@splidejs/svelte-splide/components/Splide/Splide.svelte'

  const problems = [...Array(6).keys()].map((i) => i + 1)

  let selectedProblem = 1

  const selectProblem = (e: SplideEvents['active']) => {
    selectedProblem = problems[e.detail.Slide.index]
  }
</script>

<div class="flex flex-col items-center gap-5 p-5">
  <img src="/images/logo.png" alt="Logo" class="w-24" />
  <h1 class="text-brand-red font-serif text-6xl">Judge Teams</h1>
  <Splide
    class="w-full"
    options={{
      direction: 'ttb',
      gap: 20,
      heightRatio: 1,
      pagination: false,
    }}
    on:active={selectProblem}
  >
    {#each problems as problem}
      <SplideSlide>
        <div
          class="text-brand-red flex h-full flex-col items-center justify-center rounded-full border border-current"
        >
          <div class="font-serif text-3xl">Problem</div>
          <div class="text-9xl">{problem}</div>
        </div>
      </SplideSlide>
    {/each}
  </Splide>
  <Button class="text-3xl">
    <a href={`/judge/teams/problem:${selectedProblem}`}>Go</a>
  </Button>
</div>
