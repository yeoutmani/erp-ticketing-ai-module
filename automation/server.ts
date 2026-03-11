import express from "express"
import { classifyTicket } from "./ai/classifier"
import {
  logTicketCreation,
  logWebhookExecution,
  getExecutionLogs,
  getAILatencyStats,
  getErrorStats,
  getFallbackStats,
  generateExecutionId,
  LogContext
} from "./ai/monitoring"
import "dotenv/config"

export const app = express()

app.use(express.json())

app.post("/automation/classify", async (req, res) => {
  const executionId = generateExecutionId()
  const context: LogContext = {
    executionId,
    timestamp: new Date().toISOString()
  }

  try {
    const { title, description, ticketId } = req.body

    if (ticketId) {
      context.ticketId = ticketId
      logTicketCreation(ticketId, title, description, context).catch(err =>
        console.error("Background logging error:", err)
      )
    }

    const result = await classifyTicket(title, description)

    logWebhookExecution("classification_api", "SUCCESS", context, {
      category: result.category,
      priority: result.priority,
      confidence: result.confidence
    }).catch(err => console.error("Background logging error:", err))

    res.json({ ...result, executionId })
  } catch (error) {
    console.error("Classification error:", error)

    const errorMsg = error instanceof Error ? error.message : String(error)
    logWebhookExecution("classification_api", "FAILURE", context, {
      error: errorMsg
    }).catch(err => console.error("Background logging error:", err))

    res.status(500).json({
      error: "classification_failed",
      executionId
    })
  }
})

app.get("/monitoring/execution/:executionId", async (req, res) => {
  try {
    const { executionId } = req.params
    const logs = await getExecutionLogs(executionId)

    res.json({
      executionId,
      logs,
      summary: {
        total_events: logs.length,
        success_count: logs.filter((l: any) => l.status === "success").length,
        error_count: logs.filter((l: any) => l.status === "error").length
      }
    })
  } catch (error) {
    console.error("Error fetching execution logs:", error)
    res.status(500).json({ error: "Failed to fetch logs" })
  }
})

app.get("/monitoring/latency", async (req, res) => {
  try {
    const hours = req.query.hours ? parseInt(req.query.hours as string) : 24
    const ticketId = req.query.ticketId as string | undefined

    const stats = await getAILatencyStats(ticketId, hours)

    res.json({
      period_hours: hours,
      ticketId: ticketId || "all",
      metrics: stats
    })
  } catch (error) {
    console.error("Error fetching latency stats:", error)
    res.status(500).json({ error: "Failed to fetch latency stats" })
  }
})

app.get("/monitoring/errors", async (req, res) => {
  try {
    const hours = req.query.hours ? parseInt(req.query.hours as string) : 24

    const stats = await getErrorStats(hours)

    res.json({
      period_hours: hours,
      errors: stats
    })
  } catch (error) {
    console.error("Error fetching error stats:", error)
    res.status(500).json({ error: "Failed to fetch error stats" })
  }
})

app.get("/monitoring/fallbacks", async (req, res) => {
  try {
    const hours = req.query.hours ? parseInt(req.query.hours as string) : 24

    const stats = await getFallbackStats(hours)

    res.json({
      period_hours: hours,
      fallbacks: stats
    })
  } catch (error) {
    console.error("Error fetching fallback stats:", error)
    res.status(500).json({ error: "Failed to fetch fallback stats" })
  }
})

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString()
  })
})

const PORT = 3000

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Automation API running on port ${PORT}`)
    console.log(`Monitoring endpoints available at http://localhost:${PORT}/monitoring/*`)
  })
}