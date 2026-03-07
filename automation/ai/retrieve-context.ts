import { createClient } from "@supabase/supabase-js"
import { toVector } from "./vector"
import 'dotenv/config'
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function retrieveContext(queryEmbedding: number[]) {

  const { data, error } = await supabase.rpc("match_knowledge", {
    query_embedding: toVector(queryEmbedding),
    match_count: 5
  })

  if (error) {
    console.error("Supabase RPC error:", error)
    throw error
  }

  return data
}