// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Supabase {
      Database: import('./lib/types/supabase').Database
      SchemaName: 'public'
    }
    // interface Error {}
    interface Locals {
      supabase: import('@supabase/supabase-js').SupabaseClient<
        import('./lib/types/supabase').Database
      >
    }
    interface PageData {
      session: import('@supabase/supabase-js').Session | null
    }
    // interface Platform {}
  }
}

export {}
