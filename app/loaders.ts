export async function loadSession(client) {
  const { data, error } = await client.auth.getSession()
  if (error || !data.session) {
    if (error) {
      console.error(error)
    }
    return
  }
  return data.session
}

export async function loadUser(client) {
  const { data, error } = await client.auth.getUser()
  if (error || !data.user) {
    if (error) {
      console.error(error)
    }
    return
  }
  return data.user
}
