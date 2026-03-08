import "dotenv/config"

export const AI_CONFIDENCE_THRESHOLD =
  Number(process.env.AI_CONFIDENCE_THRESHOLD) || 0.6

export const AI_TIMEOUT =
  Number(process.env.AI_TIMEOUT_MS) || 5000

export const SUPABASE_URL =
  process.env.SUPABASE_URL!

export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY!