import { buildClassificationPrompt } from "./prompt-builder"
import { callAI } from "./provider"
import { ClassificationSchema } from "./schema"
import { fallbackClassification } from "./fallback"
import { AI_CONFIDENCE_THRESHOLD, AI_TIMEOUT } from "./config"
import { generateEmbedding } from "./embeddings"
import { retrieveContext } from "./retrieve-context"

function extractJSON(text: string) {
  const match = text.match(/\{[\s\S]*\}/)
  return match ? match[0] : null
}

export async function classifyTicket(title: string, description: string) {

  let context = ""

  try {

    const embedding = await generateEmbedding(`${title} ${description}`)
    const contextDocs = await retrieveContext(embedding)

    context = contextDocs
      .slice(0, 3)
      .map((d: any) => d.content)
      .join("\n")

  } catch (err) {
    console.warn("RAG retrieval failed, continuing without context")
  }

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

  } catch (err) {
    console.warn("AI call failed:", err)
    return fallbackClassification(title, description)
  }

  let parsed

  try {

    const jsonString = extractJSON(raw)

    if (!jsonString) {
      throw new Error("No JSON found in AI response")
    }

    const json = JSON.parse(jsonString)

    parsed = ClassificationSchema.parse(json)

  } catch (err) {
    console.warn("Invalid AI JSON:", raw)
    return fallbackClassification(title, description)

  }

  if (parsed.confidence < AI_CONFIDENCE_THRESHOLD) {
    console.warn("Low AI confidence:", parsed)
    return fallbackClassification(title, description)
  }

  return parsed
}