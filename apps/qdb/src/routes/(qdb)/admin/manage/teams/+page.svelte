<script lang="ts">
  import { page } from '$app/stores'
  import Button from '$lib/components/Button.svelte'
  import Input from '$lib/components/Input.svelte'
  import * as labels from '$lib/labels'
  import { listTeamsSorted, type Team } from '$reflect/team'
  import { nanoid } from 'nanoid'
  import { z } from 'zod'

  const { r } = $page.data

  let teams: Team[] = []

  r.subscribe(
    (tx) => listTeamsSorted(tx),
    (data) => {
      teams = data
    },
  )

  const Category = z.enum(['mens', 'womens', 'youth'])

  const TeamForm = z.object({
    team_name: z.string().trim().min(1),
    member_name_1: z.string().trim().min(1),
    member_category_1: Category,
    member_name_2: z.string().trim().min(1),
    member_category_2: Category,
    member_name_3: z.string().trim().min(1),
    member_category_3: Category,
  })

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const teamForm = await TeamForm.parseAsync(
      Object.fromEntries(data.entries()),
    ).catch((err) => {
      console.error(err)
    })
    if (!teamForm) {
      return
    }
    const members: Team['members'] = ([1, 2, 3] as const).map((i) => ({
      id: nanoid(),
      name: teamForm[`member_name_${i}`],
      category: teamForm[`member_category_${i}`],
    }))
    await r.mutate.createTeam({
      id: nanoid(),
      name: teamForm.team_name,
      members,
    })
    form.reset()
  }

  const updateTeamNumbers = (e) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const numbers = Object.fromEntries(formData.entries())
    for (const team of teams) {
      r.mutate.updateTeam({
        ...team,
        number: numbers[team.id],
      })
    }
  }
</script>

<form
  class="col-span-2 flex flex-col gap-5 rounded-3xl border bg-white p-5"
  on:submit={updateTeamNumbers}
>
  {#if teams.length === 0}
    <div class="p-10 text-center">
      No teams yet.
      <br />
      Add the first one 👉
    </div>
  {/if}
  {#each teams as team}
    <div class="grid grid-cols-6 items-center gap-5">
      <h2 class="col-span-2 text-3xl">
        <Input
          type="text"
          name={team.id}
          value={team.number}
          class="w-20 text-center"
        />
        {team.name}
      </h2>
      {#each team.members as member}
        <div class="flex items-center gap-5">
          <div class="text-3xl">{labels.categories[member.category]}</div>
          {member.name}
        </div>
      {/each}
      <div class="text-right">
        <Button
          type="button"
          class="!bg-brand-red"
          on:click={() => r.mutate.deleteTeam(team.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  {/each}
  <Button type="submit">Save</Button>
</form>

<form
  on:submit={handleSubmit}
  class="flex flex-col gap-5 rounded-3xl border bg-white p-5"
>
  <h2 class="text-3xl">New Team</h2>
  <Input name="team_name" placeholder="Team Name" />
  {#each [1, 2, 3] as i}
    <div class="accent-brand-green flex items-center gap-5">
      <Input name={`member_name_${i}`} placeholder="Member Name" />
      {#each Object.entries(labels.categories) as [category, label]}
        <label class="text-3xl">
          <input type="radio" name={`member_category_${i}`} value={category} />
          {label}
        </label>
      {/each}
    </div>
  {/each}
  <Button type="submit" class="self-start">Add team</Button>
</form>
