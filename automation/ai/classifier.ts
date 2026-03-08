import { buildClassificationPrompt } from "./prompt-builder"
import { callAI } from "./provider"
import { ClassificationSchema } from "./schema"
import { fallbackClassification } from "./fallback"
import { AI_CONFIDENCE_THRESHOLD } from "./config"
import { generateEmbedding } from "./embeddings"
import { retrieveContext } from "./retrieve-context"

const AI_TIMEOUT = 3000

export async function classifyTicket(title: string, description: string) {

  const embedding = await generateEmbedding(`${title} ${description}`)
  const contextDocs = await retrieveContext(embedding)
  const context = contextDocs
    .slice(0, 3)
    .map((d: any) => d.content)
    .join("\n")
  
  const prompt = buildClassificationPrompt({
    title,
    description,
    context
  })

  let raw: string

  try {

    raw = await Promise.race([
      callAI(prompt),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("AI timeout")), AI_TIMEOUT)
      )
    ])

  } catch {
    return fallbackClassification(title, description)
  }

  let parsed

  try {
    const json = JSON.parse(raw)
    parsed = ClassificationSchema.parse(json)
  } catch {
    return fallbackClassification(title, description)
  }

  if (parsed.confidence < AI_CONFIDENCE_THRESHOLD) {
    return fallbackClassification(title, description)
  }

  return parsed
}