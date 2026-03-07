import { generateEmbedding } from "../../ai/embeddings"

async function run() {

  const embedding = await generateEmbedding("Server down urgent")

  console.log("Embedding length:", embedding.length)

}

run()