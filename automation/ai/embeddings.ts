import { ollama } from "./ollama-client" 

export async function generateEmbedding(text: string): Promise<number[]> {

  const response = await ollama.embeddings({
    model: "nomic-embed-text",
    prompt: text
  })

  return response.embedding as number[]
}