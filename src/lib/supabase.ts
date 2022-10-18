import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = 'https://mjwhlbnhwjrecyhjdzjj.supabase.co'
const supabaseKey = import.meta.env.SUPABASE_KEY
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export default supabase