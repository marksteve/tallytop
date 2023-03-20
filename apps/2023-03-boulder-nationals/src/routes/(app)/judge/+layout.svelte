<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { categories, rounds } from '$lib/labels'
  import * as R from 'ramda'

  let crumbs = []

  $: {
    crumbs = [
      { type: 'round', options: R.toPairs(rounds), value: $page.params.round },
      { type: 'category', options: R.toPairs(categories), value: $page.params.category }
    ]
  }

  const handleChange = (crumb) => {
    const { type, value } = crumb
    if (type === 'round') {
      if ($page.params.category) {
        goto(`/judge/${value}/${$page.params.category}`)
      } else {
        goto(`/judge/${value}`)
      }
    }
    if (type === 'category') {
      goto(`/judge/${$page.params.round}/${value}`)
    }
  }
</script>

<div class="flex flex-1 flex-col">
  <div class="flex items-center">
    {#each crumbs as crumb}
      {#if crumb.value}
        <div class="border-brand flex-1 border-t px-5 py-2">
          <select
            class="font-bold"
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
