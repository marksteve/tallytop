<script lang="ts">
  import Dialog from '$lib/components/dialog.svelte'
  import { Auth } from '@supabase/auth-ui-svelte'
  import type { Session, SupabaseClient } from '@supabase/supabase-js'
  import ThumbsUp from 'phosphor-svelte/lib/ThumbsUp'

  export let value = false
  export let supabase: SupabaseClient
  export let session: Session | null
  export let url: string
  export let route_no: string

  const toggleTsek = async () => {
    if (!session) {
      return
    }
    const prev = value
    value = !value
    try {
      if (value) {
        await supabase.from('tseklist_tseks').insert({
          user_id: session.user.id,
          route_no: route_no,
        })
      } else {
        await supabase
          .from('tseklist_tseks')
          .delete()
          .eq('user_id', session.user.id)
          .eq('route_no', route_no)
      }
    } catch {
      value = prev
    }
  }
</script>

{#if session}
  <button on:click={toggleTsek}>
    <ThumbsUp weight={value ? 'fill' : 'regular'} />
  </button>
{:else}
  <Dialog>
    <svelte:fragment slot="trigger">
      <ThumbsUp />
    </svelte:fragment>
    <svelte:fragment slot="title">Login</svelte:fragment>
    <Auth
      supabaseClient={supabase}
      view="magic_link"
      redirectTo={`${url}/auth/callback`}
      appearance={{ className: { button: 'button', input: 'input' } }}
    />
  </Dialog>
{/if}
