import 'zx/globals'
$.verbose = false

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const password = await question('Judge password:\n')

const {
  error,
  data: { user }
} = await supabase.auth.admin.createUser({
  email: process.env.JUDGE_EMAIL,
  password,
  email_confirm: true
})
if (error) {
  throw error
}

echo(`Judge created: ${user?.email}`)
