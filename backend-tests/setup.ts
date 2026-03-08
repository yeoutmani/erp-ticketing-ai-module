import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '../automation/.env' })

const supabaseUrl = process.env.SUPABASE_URL!
const anonKey = process.env.SUPABASE_ANON_KEY!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const createAnonClient = () => {
  return createClient(supabaseUrl, anonKey)
}

export const createServiceClient = () => {
  return createClient(supabaseUrl, serviceRoleKey)
}