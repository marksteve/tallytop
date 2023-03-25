<script lang="ts">
  import { browser } from '$app/environment'
  import { Countdown } from '@tallytop/ui'
  import sponsor2 from './8a.png'
  import sponsor1 from './bhive.png'
  import sponsor3 from './pilipinas-climbing.png'

  const isLiveStream = browser ? window.location.search.endsWith('livestream') : false

  let eventStart = new Date(2023, 3 - 1, 25, 7)
  const schedule = [
    {
      round: `Open Women's Qualifiers`,
      start: new Date(2023, 3 - 1, 25, 8),
      end: new Date(2023, 3 - 1, 25, 10)
    },
    {
      round: `Open Men's Qualifiers`,
      start: new Date(2023, 3 - 1, 25, 11, 55),
      end: new Date(2023, 3 - 1, 25, 14, 55)
    },
    {
      round: `Inter Women's Qualifiers`,
      start: new Date(2023, 3 - 1, 25, 15, 10),
      end: new Date(2023, 3 - 1, 25, 15, 55)
    },
    {
      round: `Inter Men's Qualifiers`,
      start: new Date(2023, 3 - 1, 25, 16, 40),
      end: new Date(2023, 3 - 1, 25, 18, 10)
    },
    {
      round: `Open Men's Semi-Finals`,
      start: new Date(2023, 3 - 1, 25, 19, 10),
      end: new Date(2023, 3 - 1, 25, 21, 30)
    }
  ]
  const upcoming = schedule.find((s) => s.start > Date.now())
  const ongoing = schedule.find((s) => s.start < Date.now() && s.end > Date.now())
  const sponsors = [sponsor1, sponsor2, sponsor3]
</script>

<div
  class="bg-brand grid max-h-screen auto-rows-fr grid-cols-2 gap-0.5 text-xl font-bold md:grid-cols-6 md:text-3xl"
>
  <div class="col-span-2 bg-white p-10 md:col-span-3 md:row-span-2">
    <img class="h-full w-full" src="/images/logo.svg" />
  </div>
  <div class="contents bg-white md:block" />
  <div class="text-brand flex items-center justify-center bg-white p-10">
    {#if !isLiveStream}
      <a class="outline-brand rounded-xl p-2 outline-4 hover:outline" href="/scores">SCORES</a>
    {/if}
  </div>
  <div class="bg-brand flex items-center justify-center text-white">
    {#if !isLiveStream}
      <a class="rounded-xl p-2 outline-4 outline-white hover:outline" href="/competitors">
        COMPETITORS
      </a>
    {/if}
  </div>
  <div class="contents bg-white md:block" />
  <div class="contents md:block" />
  <div class="contents bg-white md:block" />
  <div class="text-brand col-span-2 bg-white p-10">
    {#if eventStart > Date.now()}
      <div>EVENT STARTS IN</div>
      <div class="text-6xl md:text-8xl">
        <Countdown to={eventStart} />
      </div>
    {:else if ongoing}
      <div class="text-4xl font-bold uppercase md:text-6xl">
        {ongoing.round}
      </div>
      <div>ONGOING</div>
    {:else if upcoming}
      <div class="text-4xl font-bold uppercase md:text-6xl">
        {upcoming.round}
      </div>
      <div>STARTS IN <Countdown to={upcoming.start} /></div>
    {/if}
  </div>
  <div />
  {#each sponsors as sponsor}
    <div class="bg-white p-10">
      <img class="h-full w-full object-contain" src={sponsor} />
    </div>
  {/each}
</div>
