<script lang="ts">
  import { Countdown } from '@tallytop/ui'

  let eventStart = new Date(2023, 3 - 1, 24)
</script>

<div
  class="bg-brand grid max-h-screen auto-rows-fr grid-cols-2 gap-0.5 text-xl font-bold md:grid-cols-6 md:text-3xl"
>
  <div class="col-span-2 bg-white p-10 md:col-span-3 md:row-span-2">
    <img class="h-full w-full" src="/images/logo.svg" />
  </div>
  <div class="contents bg-white md:block" />
  <div class="text-brand flex items-center justify-center bg-white p-10">
    <div class="outline-brand rounded-xl p-2 outline-4 hover:outline">SCORES</div>
  </div>
  <div class="bg-brand flex items-center justify-center text-white">
    <a class="rounded-xl p-2 outline-4 outline-white hover:outline" href="/competitors">
      COMPETITORS
    </a>
  </div>
  <div class="contents bg-white md:block" />
  <div class="contents md:block" />
  <div class="contents bg-white md:block" />
  <div class="text-brand col-span-2 bg-white p-10">
    <div>EVENT STARTS IN</div>
    <div class="text-6xl md:text-8xl"><Countdown to={eventStart} /></div>
  </div>
  <div />
  <div class="bg-white p-10">
    <img class="h-full w-full object-contain" src="/images/sponsors/bhive.png" />
  </div>
  <div class="bg-white p-10">
    <img class="h-full w-full object-contain" src="/images/sponsors/8a.png" />
  </div>
  <div class="bg-white p-10">
    <img class="h-full w-full object-contain" src="/images/sponsors/pilipinas-climbing.png" />
  </div>
</div>
