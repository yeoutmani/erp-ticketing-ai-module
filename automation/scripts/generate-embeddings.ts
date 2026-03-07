import { createClient } from "@supabase/supabase-js"
import { generateEmbedding } from "../ai/embeddings.js"
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {

  const savTickets = [
    "Server down production urgent",
    "Database connection error",
    "Billing invoice incorrect",
    "User cannot login",
    "API returning 500 error"
  ]

  for (const content of savTickets) {

    const embedding = await generateEmbedding(content)

    await supabase.from("knowledge_base").insert({
      content,
      embedding,
      category: "technical"
    })

    console.log("Stored:", content)
  }

}

run()