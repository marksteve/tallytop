<script lang="ts">
  import { beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import { redirect } from '@sveltejs/kit'
  import type { LayoutData } from './$types'

  export let data: LayoutData

  beforeNavigate(() => {
    if (
      $page.url.pathname.startsWith('/admin') &&
      data.credentials.userID === 'public'
    ) {
      throw redirect(302, '/login')
    }
  })
</script>

<svelte:head>
  <title>QDB 2023 - a bhive pamaskomp</title>
</svelte:head>

<slot />
