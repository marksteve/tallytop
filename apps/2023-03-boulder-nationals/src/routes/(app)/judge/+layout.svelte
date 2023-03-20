<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { categories, rounds } from '$lib/labels'
  import * as R from 'ramda'

  let crumbs = []

  $: {
    crumbs = [
      { type: 'round', options: R.toPairs(rounds), value: $page.params.round },
      { type: 'category', options: R.toPairs(categories), value: $page.params.category },
      { type: 'problem', options: $page.data.problems, value: $page.params.problem_id }
    ]
  }

  const handleChange = (crumb) => {
    const { type, value } = crumb
    let { round, category, problem_id, competitor_id } = $page.params
    switch (type) {
      case 'round':
        round = value
        problem_id = ''
        competitor_id = ''
        break
      case 'category':
        category = value
        problem_id = ''
        competitor_id = ''
        break
      case 'problem':
        problem_id = value
        break
    }
    const path = [round, category, problem_id, competitor_id].filter(Boolean).join('/')
    goto(`/judge/${path}`)
  }
</script>

<div class="flex flex-1 flex-col">
  <div class="flex items-center">
    {#each crumbs as crumb}
      {#if crumb.value}
        <div class="border-brand flex-1 border-t px-5 py-2">
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
