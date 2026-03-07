import { buildClassificationPrompt } from "./prompt-builder"
import { callAI } from "./provider"
import { ClassificationSchema } from "./schema"

export async function classifyTicket(
  title: string,
  description: string
): Promise<Classification> {
  const prompt = buildClassificationPrompt({ title, description })

  const raw = await callAI(prompt)

  let parsed

  try {
    const json = JSON.parse(raw)
    parsed = ClassificationSchema.parse(json)
   } catch (err) {
     throw new Error(`Invalid AI response: ${err}`)
  }

  if (parsed.confidence < 0.7) {
    return {
      priority: "medium",
      category: "general",
      confidence: parsed.confidence
    }
  }

  return parsed
}