export async function loadSession(supabase) {
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) {
    if (error) {
      console.error(error)
    }
    return
  }
  return data.session
}

export async function loadUser(supabase) {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    if (error) {
      console.error(error)
    }
    return
  }
  return data.user
}

