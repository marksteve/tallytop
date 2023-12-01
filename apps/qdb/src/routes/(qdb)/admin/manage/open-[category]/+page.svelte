<script lang="ts">
  import { beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/components/Button.svelte'
  import Input from '$lib/components/Input.svelte'
  import {
    listCompetitorsByCategory,
    type Competitor,
  } from '$reflect/competitor'
  import { nanoid } from 'nanoid'
  import { z } from 'zod'

  const { r } = $page.data

  let subscribers: Array<() => void> = []
  let competitors: Competitor[] = []

  $: category = `open-${$page.params.category}`

  beforeNavigate(() => {
    subscribers.forEach((unsubscribe) => unsubscribe())
  })

  $: subscribers = [
    ...subscribers,
    r.subscribe(
      (tx) => listCompetitorsByCategory(tx, category),
      (data) => {
        competitors = data
      },
    ),
  ]

  const Category = z.enum(['open-m', 'open-w'])

  const CompetitorForm = z.object({
    name: z.string().trim().min(1),
    category: Category,
  })

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const competitorForm = await CompetitorForm.parseAsync({
      ...Object.fromEntries(data.entries()),
      category,
    }).catch((err) => {
      console.error(err)
    })
    if (!competitorForm) {
      return
    }
    await r.mutate.createCompetitor({
      id: nanoid(),
      ...competitorForm,
    })
    form.reset()
  }

  const updateCompetitorNumbers = (e) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const numbers = Object.fromEntries(formData.entries())
    for (const competitor of competitors) {
      r.mutate.updateCompetitor({
        ...competitor,
        number: numbers[competitor.id],
      })
    }
  }
</script>

<form
  class="col-span-2 flex flex-col gap-5 rounded-3xl border bg-white p-5"
  on:submit={updateCompetitorNumbers}
>
  {#if competitors.length === 0}
    <div class="p-10 text-center">
      No competitors yet.
      <br />
      Add the first one 👉
    </div>
  {:else}
    {#each competitors as competitor}
      <div class="grid grid-cols-2 items-center gap-5">
        <h2 class="text-3xl">
          <Input
            type="text"
            name={competitor.id}
            value={competitor.number}
            class="w-20 text-center"
          />
          {competitor.name}
        </h2>
        <div class="text-right">
          <Button
            type="button"
            class="!bg-brand-red"
            on:click={() => r.mutate.deleteCompetitor(competitor.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    {/each}
    <Button type="submit">Save</Button>
  {/if}
</form>

<form
  on:submit={handleSubmit}
  class="flex flex-col gap-5 rounded-3xl border bg-white p-5"
>
  <h2 class="text-3xl">New Competitor</h2>
  <Input name="name" placeholder="Name" />
  <Button type="submit" class="self-start">Add competitor</Button>
</form>
