import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

export const supabaseUrl = process.env.SUPABASE_URL!
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const createTestClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}