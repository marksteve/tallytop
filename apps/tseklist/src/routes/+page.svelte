<script lang="ts">
  import Tsek from '$lib/components/tsek.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  const rating = (score: string | null, max = 3) =>
    score
      ? new Array(max)
          .fill(null)
          .map((_, i) => (i >= Number(score) ? '☆' : '★'))
          .join(' ')
      : ''

  const logout = () => data.supabase.auth.signOut()
</script>

<main class="flex flex-col bg-white text-base text-black">
  <div class="flex justify-between p-6">
    <div>
      <h1 class="text-6xl">Tseklist</h1>
      <p>List of crags in the Philippines. How much have you tsek'd out?</p>
    </div>
    <div>
      <button class="button text-xl"> Share your Tseklist </button>
    </div>
  </div>
  {#if data.session}
    <div class="flex items-center gap-6 p-6">
      <div>
        Logged in as {data.session?.user.email}
      </div>
      <button class="button" on:click={logout}>Logout</button>
    </div>
  {/if}
  <table cellspacing="0" cellpadding="0" class="whitespace-nowrap">
    <thead>
      <tr>
        <td class="w-0"></td>
        <td class="w-0">Tsek?</td>
        <td class="w-0">Province</td>
        <td class="w-0">Area</td>
        <td class="w-0">Wall</td>
        <td>Name</td>
        <td class="w-0">Clips</td>
        <td class="w-0">Difficulty</td>
        <td class="w-0">Rating</td>
      </tr>
    </thead>
    <tbody>
      {#each data.routes as { route_no, province, area, crag, name, clips, difficulty, score }}
        <tr>
          <td>{route_no}</td>
          <td class="flex justify-center text-2xl">
            <Tsek
              supabase={data.supabase}
              session={data.session}
              url={data.url}
              {route_no}
              value={data.tseks?.some(
                (tsek) => tsek.route_no === Number(route_no),
              ) ?? false}
            />
          </td>
          <td>{province}</td>
          <td>{area}</td>
          <td>{crag}</td>
          <td>{name}</td>
          <td>{clips ?? ''}</td>
          <td>{difficulty ?? ''}</td>
          <td>{rating(score)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  thead td {
    @apply border-b border-current p-2;
  }
  tbody td {
    @apply p-2;
  }
  tbody tr:hover {
    @apply bg-black text-white;
  }
</style>
