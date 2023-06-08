import supabase from '$lib/supabase'
import type { Actions } from './$types'

export const actions = {
  default: async (event) => {
    const formData = await event.request.formData()
    const email = formData.get('email')?.toString()
    if (!email) throw new Error('Email is required')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'https://roc-royale.tallytop.com/' },
    })
    if (error) {
      throw error
    }
    return { email, success: true }
  },
} satisfies Actions
