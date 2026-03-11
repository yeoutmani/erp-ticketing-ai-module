import { buildClassificationPrompt } from "./prompt-builder"
import { callAI } from "./provider"
import { ClassificationSchema } from "./schema"
import { fallbackClassification } from "./fallback"
import { AI_CONFIDENCE_THRESHOLD, AI_TIMEOUT } from "./config"
import { generateEmbedding } from "./embeddings"
import { retrieveContext } from "./retrieve-context"
import {
  generateExecutionId,
  logAILatency,
  logAIFailure,
  logFallbackUsage,
  AILatencyMetrics,
  LogContext
} from "./monitoring"

function extractJSON(text: string) {
  const match = text.match(/\{[\s\S]*\}/)
  return match ? match[0] : null
}

export async function classifyTicket(title: string, description: string) {
  const executionId = generateExecutionId()
  const context: LogContext = {
    executionId,
    timestamp: new Date().toISOString()
  }

  const metrics: AILatencyMetrics = {
    promptBuildTime: 0,
    embeddingTime: 0,
    retrievalTime: 0,
    aiCallTime: 0,
    totalTime: 0,
    timeoutOccurred: false
  }

  const startTime = Date.now()
  let ragContext = ""

  try {
    const embeddingStart = Date.now()
    const embedding = await generateEmbedding(`${title} ${description}`)
    metrics.embeddingTime = Date.now() - embeddingStart

    const retrievalStart = Date.now()
    const contextDocs = await retrieveContext(embedding)
    metrics.retrievalTime = Date.now() - retrievalStart

    ragContext = contextDocs
      .slice(0, 3)
      .map((d: any) => d.content)
      .join("\n")
  } catch (err) {
    console.warn("RAG retrieval failed, continuing without context", err)
  }

  const promptStart = Date.now()
  const prompt = buildClassificationPrompt({
    title,
    description,
    context: ragContext
  })
  metrics.promptBuildTime = Date.now() - promptStart

  let raw: string

  try {
    const aiStart = Date.now()
    raw = await Promise.race([
      callAI(prompt),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("AI timeout")), AI_TIMEOUT)
      )
    ])
    metrics.aiCallTime = Date.now() - aiStart
  } catch (err) {
    const isTimeout = err instanceof Error && err.message === "AI timeout"
    metrics.timeoutOccurred = isTimeout

    console.warn("AI call failed:", err)
    const failureType = isTimeout ? "TIMEOUT" : "API_ERROR"
    
    logAIFailure(err instanceof Error ? err : "Unknown error", failureType, context, {
      ai_timeout_ms: AI_TIMEOUT
    }).catch(e => console.error("Background logging error:", e))

    const fallbackResult = fallbackClassification(title, description)
    
    logFallbackUsage(
      isTimeout ? "AI_TIMEOUT" : "AI_FAILURE",
      fallbackResult,
      context
    ).catch(e => console.error("Background logging error:", e))

    metrics.totalTime = Date.now() - startTime
    logAILatency(metrics, context).catch(e => console.error("Background logging error:", e))

    return fallbackResult
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
    
    logAIFailure(
      err instanceof Error ? err.message : "JSON parsing failed",
      "JSON_PARSE",
      context,
      { raw_response: raw }
    ).catch(e => console.error("Background logging error:", e))

    const fallbackResult = fallbackClassification(title, description)
    
    logFallbackUsage("INVALID_JSON", fallbackResult, context)
      .catch(e => console.error("Background logging error:", e))

    metrics.totalTime = Date.now() - startTime
    logAILatency(metrics, context).catch(e => console.error("Background logging error:", e))

    return fallbackResult
  }

  if (parsed.confidence < AI_CONFIDENCE_THRESHOLD) {
    console.warn("Low AI confidence:", parsed)
    
    logAIFailure(
      `Confidence ${parsed.confidence} below threshold ${AI_CONFIDENCE_THRESHOLD}`,
      "LOW_CONFIDENCE",
      context,
      { confidence: parsed.confidence, threshold: AI_CONFIDENCE_THRESHOLD }
    ).catch(e => console.error("Background logging error:", e))

    const fallbackResult = fallbackClassification(title, description)
    
    logFallbackUsage("LOW_CONFIDENCE", fallbackResult, context)
      .catch(e => console.error("Background logging error:", e))

    metrics.totalTime = Date.now() - startTime
    logAILatency(metrics, context).catch(e => console.error("Background logging error:", e))

    return fallbackResult
  }

  metrics.totalTime = Date.now() - startTime
  logAILatency(metrics, context).catch(e => console.error("Background logging error:", e))

  console.log(
    `Classification succeeded for execution ${executionId}: ${parsed.category}/${parsed.priority} (confidence: ${parsed.confidence})`
  )

  return parsed
}