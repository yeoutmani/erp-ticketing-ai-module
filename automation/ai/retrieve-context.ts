import { createClient } from "@supabase/supabase-js"
import { toVector } from "./vector"
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./config"

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
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