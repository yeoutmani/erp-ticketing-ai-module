import { createClient } from "@supabase/supabase-js"
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "./config"

const supabase = createClient(
  SUPABASE_URL || "",
  SUPABASE_SERVICE_ROLE_KEY || ""
)

export interface LogContext {
  executionId: string
  workflowId?: string
  ticketId?: string
  userId?: string
  timestamp: string
}

export interface AILatencyMetrics {
  promptBuildTime: number
  embeddingTime: number
  retrievalTime: number
  aiCallTime: number
  totalTime: number
  timeoutOccurred: boolean
}

export function generateExecutionId(): string {
  return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function logTicketCreation(
  ticketId: string,
  title: string,
  description: string,
  context: LogContext
): Promise<void> {
  try {
    await supabase.from("automation_logs").insert({
      execution_id: context.executionId,
      ticket_id: ticketId,
      event_type: "TICKET_CREATED",
      event_data: {
        title,
        description_length: description.length
      },
      timestamp: context.timestamp,
      status: "success"
    })
  } catch (error) {
    console.error("Failed to log ticket creation:", error)
  }
}

export async function logAILatency(
  metrics: AILatencyMetrics,
  context: LogContext
): Promise<void> {
  try {
    await supabase.from("automation_logs").insert({
      execution_id: context.executionId,
      ticket_id: context.ticketId,
      event_type: "AI_LATENCY",
      event_data: {
        prompt_build_ms: metrics.promptBuildTime,
        embedding_ms: metrics.embeddingTime,
        retrieval_ms: metrics.retrievalTime,
        ai_call_ms: metrics.aiCallTime,
        total_ms: metrics.totalTime,
        timeout_occurred: metrics.timeoutOccurred
      },
      timestamp: context.timestamp,
      latency_ms: metrics.totalTime,
      execution_finished_at: context.timestamp,
      status: "success"
    })
  } catch (error) {
    console.error("Failed to log AI latency:", error)
  }
}

export async function logAIFailure(
  error: Error | string,
  failureType: "TIMEOUT" | "JSON_PARSE" | "API_ERROR" | "LOW_CONFIDENCE",
  context: LogContext,
  details?: Record<string, any>
): Promise<void> {
  try {
    const errorMessage = error instanceof Error ? error.message : String(error)
    await supabase.from("automation_logs").insert({
      execution_id: context.executionId,
      ticket_id: context.ticketId,
      event_type: "AI_FAILURE",
      event_data: {
        failure_type: failureType,
        error_message: errorMessage,
        ...details
      },
      timestamp: context.timestamp,
      status: "error",
      error: errorMessage
    })
  } catch (error) {
    console.error("Failed to log AI failure:", error)
  }
}

export async function logWebhookExecution(
  webhookId: string,
  result: "SUCCESS" | "FAILURE",
  context: LogContext,
  details?: Record<string, any>
): Promise<void> {
  try {
    await supabase.from("automation_logs").insert({
      execution_id: context.executionId,
      ticket_id: context.ticketId,
      event_type: "WEBHOOK_EXECUTION",
      event_data: {
        webhook_id: webhookId,
        ...details
      },
      timestamp: context.timestamp,
      status: result === "SUCCESS" ? "success" : "error"
    })
  } catch (error) {
    console.error("Failed to log webhook execution:", error)
  }
}

export async function logFallbackUsage(
  reason: "AI_TIMEOUT" | "AI_FAILURE" | "LOW_CONFIDENCE" | "INVALID_JSON" | "RAG_FAILURE",
  fallbackResult: Record<string, any>,
  context: LogContext
): Promise<void> {
  try {
    await supabase.from("automation_logs").insert({
      execution_id: context.executionId,
      ticket_id: context.ticketId,
      event_type: "FALLBACK_USAGE",
      event_data: {
        reason,
        fallback_result: fallbackResult
      },
      timestamp: context.timestamp,
      status: "success"
    })
  } catch (error) {
    console.error("Failed to log fallback usage:", error)
  }
}

export async function getExecutionLogs(executionId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("automation_logs")
      .select("*")
      .eq("execution_id", executionId)
      .order("timestamp", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Failed to retrieve execution logs:", error)
    return []
  }
}

export async function getAILatencyStats(
  ticketId?: string,
  hours: number = 24
): Promise<any> {
  try {
    const fromDate = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

    let query = supabase
      .from("automation_logs")
      .select("event_data")
      .eq("event_type", "AI_LATENCY")
      .gte("timestamp", fromDate)

    if (ticketId) {
      query = query.eq("ticket_id", ticketId)
    }

    const { data, error } = await query

    if (error) throw error

    if (!data || data.length === 0) {
      return {
        count: 0,
        avg_total_ms: 0,
        max_total_ms: 0,
        min_total_ms: 0
      }
    }

    const latencies = data.map((log: any) => log.event_data.total_ms)
    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length

    return {
      count: data.length,
      avg_total_ms: Math.round(avgLatency),
      max_total_ms: Math.max(...latencies),
      min_total_ms: Math.min(...latencies)
    }
  } catch (error) {
    console.error("Failed to get AI latency stats:", error)
    return null
  }
}

export async function getErrorStats(hours: number = 24): Promise<any> {
  try {
    const fromDate = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from("automation_logs")
      .select("event_type, event_data")
      .eq("status", "error")
      .gte("timestamp", fromDate)

    if (error) throw error

    if (!data || data.length === 0) {
      return {
        total_errors: 0,
        by_type: {}
      }
    }

    const byType: Record<string, number> = {}
    data.forEach((log: any) => {
      const type = log.event_type
      byType[type] = (byType[type] || 0) + 1
    })

    return {
      total_errors: data.length,
      by_type: byType
    }
  } catch (error) {
    console.error("Failed to get error stats:", error)
    return null
  }
}

export async function getFallbackStats(hours: number = 24): Promise<any> {
  try {
    const fromDate = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from("automation_logs")
      .select("event_data")
      .eq("event_type", "FALLBACK_USAGE")
      .gte("timestamp", fromDate)

    if (error) throw error

    if (!data || data.length === 0) {
      return {
        total_fallbacks: 0,
        by_reason: {}
      }
    }

    const byReason: Record<string, number> = {}
    data.forEach((log: any) => {
      const reason = log.event_data.reason
      byReason[reason] = (byReason[reason] || 0) + 1
    })

    return {
      total_fallbacks: data.length,
      by_reason: byReason
    }
  } catch (error) {
    console.error("Failed to get fallback stats:", error)
    return null
  }
}
