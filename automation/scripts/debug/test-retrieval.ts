import { generateEmbedding } from "../../ai/embeddings"
import { retrieveContext } from "../../ai/retrieve-context"

async function run() {

  const embedding = await generateEmbedding("server down production")

  const docs = await retrieveContext(embedding)

  console.log("Retrieved docs:")
  console.log(docs)

}

run()