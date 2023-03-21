import 'zx/globals'
$.verbose = false

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const file = await question('JSON file path:\n')
const rows = await fs.readJSON(file)

for (let row of rows) {
  await supabase.from('competitors').upsert(row)
}

console.log('Done!')
