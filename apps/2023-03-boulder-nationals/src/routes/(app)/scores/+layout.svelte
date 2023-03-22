<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { categories, rounds } from '$lib/labels'
  import * as R from 'ramda'

  let crumbs = []

  $: {
    crumbs = [
      { type: 'round', options: R.toPairs(rounds), value: $page.params.round },
      {
        type: 'category',
        options: R.toPairs(categories).filter(([category]) =>
          $page.params.round === 'semis' ? category === 'open_m' : true
        ),
        value: $page.params.category
      },
    ]
  }

  const handleChange = (crumb) => {
    const { type, value } = crumb
    let { round, category, competitor_id } = $page.params
    switch (type) {
      case 'round':
        round = value
        if (value === 'semis') {
          category = ''
        }
        competitor_id = ''
        break
      case 'category':
        category = value
        competitor_id = ''
        break
    }
    const path = [round, category, competitor_id].filter(Boolean).join('/')
    goto(`/scores/${path}`)
  }
</script>

<div class="flex flex-1 flex-col">
  <div class="flex items-center">
    {#each crumbs as crumb}
      {#if crumb.value}
        <div class="border-brand flex-1 border-t px-5 py-2 text-center">
          <select
            class="bg-white font-bold"
            value={crumb.value}
            on:change={(e) => handleChange({ type: crumb.type, value: e.target.value })}
          >
            {#each crumb.options as [value, label]}
              <option {value}>{label}</option>
            {/each}
          </select>
        </div>
      {/if}
    {/each}
  </div>
  <div
    class="bg-brand grid flex-1 auto-rows-fr grid-cols-1 items-center justify-items-center pb-20"
  >
    <slot />
  </div>
</div>
