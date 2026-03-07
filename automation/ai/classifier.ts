import { buildClassificationPrompt } from "./prompt-builder"
import { callAI } from "./provider"
import { ClassificationSchema } from "./schema"
import { fallbackClassification } from "./fallback"

const CONFIDENCE_THRESHOLD = 0.7
const AI_TIMEOUT = 3000

export async function classifyTicket(title: string, description: string) {

  const prompt = buildClassificationPrompt({ title, description })

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

  if (parsed.confidence < CONFIDENCE_THRESHOLD) {
    return fallbackClassification(title, description)
  }

  return parsed
}