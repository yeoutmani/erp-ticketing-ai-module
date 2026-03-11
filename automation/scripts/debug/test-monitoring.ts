import { createClient } from "@supabase/supabase-js"
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "../../ai/config"

const supabase = createClient(
  SUPABASE_URL || "",
  SUPABASE_SERVICE_ROLE_KEY || ""
)

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

async function testMonitoring() {
  console.log("Testing Monitoring System...")
  console.log("============================\n")

  try {
    console.log("1. Checking automation_logs table exists...")
    const { data: tableData, error: tableError } = await supabase
      .from("automation_logs")
      .select("id")
      .limit(1)

    if (tableError) {
      console.error("Table does not exist:", tableError.message)
      console.log("\nMake sure to run the migration:")
      console.log("  supabase migration up")
      return
    }
    console.log("✓ automation_logs table exists\n")

    console.log("2. Testing log insertion...")
    const testExecutionId = `test_${Date.now()}`
    const testTicketId = generateUUID()
    const { error: insertError } = await supabase.from("automation_logs").insert({
      execution_id: testExecutionId,
      ticket_id: testTicketId,
      event_type: "TICKET_CREATED",
      event_data: {
        title: "Test Ticket",
        description_length: 100
      },
      status: "success"
    })

    if (insertError) {
      console.error(" Failed to insert log:", insertError.message)
      return
    }
    console.log(" Test log inserted successfully\n")

    console.log("3. Testing log retrieval...")
    const { data: logs, error: retrieveError } = await supabase
      .from("automation_logs")
      .select("*")
      .eq("execution_id", testExecutionId)
      .order("timestamp", { ascending: true })

    if (retrieveError) {
      console.error(" Failed to retrieve logs:", retrieveError.message)
      return
    }

    if (!logs || logs.length === 0) {
      console.error(" No logs found after insertion")
      return
    }

    console.log(` Retrieved ${logs.length} log entries`)
    console.log(`  Sample log:`, JSON.stringify(logs[0], null, 2), "\n")

    console.log("4. Testing error logging...")
    const errorExecutionId = `error_test_${Date.now()}`
    const errorTicketId = generateUUID()
    const { error: errorInsertError } = await supabase
      .from("automation_logs")
      .insert({
        execution_id: errorExecutionId,
        ticket_id: errorTicketId,
        event_type: "AI_FAILURE",
        event_data: {
          failure_type: "TIMEOUT",
          error_message: "AI timeout after 30000ms"
        },
        status: "error",
        error: "AI timeout after 30000ms"
      })

    if (errorInsertError) {
      console.error(" Failed to insert error log:", errorInsertError.message)
      return
    }
    console.log(" Error log inserted successfully\n")

    console.log("5. Testing latency logging...")
    const latencyExecutionId = `latency_test_${Date.now()}`
    const latencyTicketId = generateUUID()
    const { error: latencyInsertError } = await supabase
      .from("automation_logs")
      .insert({
        execution_id: latencyExecutionId,
        ticket_id: latencyTicketId,
        event_type: "AI_LATENCY",
        event_data: {
          prompt_build_ms: 50,
          embedding_ms: 300,
          retrieval_ms: 150,
          ai_call_ms: 2300,
          total_ms: 2800,
          timeout_occurred: false
        },
        latency_ms: 2800,
        status: "success"
      })

    if (latencyInsertError) {
      console.error(" Failed to insert latency log:", latencyInsertError.message)
      return
    }
    console.log(" Latency log inserted successfully\n")
    console.log("6. Testing statistics queries...")

    const { data: eventCounts } = await supabase
      .from("automation_logs")
      .select("event_type")
      .gte("timestamp", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    const countByType: Record<string, number> = {}
    eventCounts?.forEach((log: any) => {
      countByType[log.event_type] = (countByType[log.event_type] || 0) + 1
    })

    console.log("✓ Event type distribution (last 24h):")
    Object.entries(countByType).forEach(([type, count]) => {
      console.log(`    ${type}: ${count}`)
    })
    console.log()

    console.log("7. Testing error filtering...")
    const { data: errors } = await supabase
      .from("automation_logs")
      .select("event_type, event_data")
      .eq("status", "error")
      .gte("timestamp", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (errors && errors.length > 0) {
      console.log(` Found ${errors.length} errors in last 24h:`)
      errors.forEach((error: any) => {
        console.log(`    - ${error.event_type}: ${error.event_data?.failure_type || "unknown"}`)
      })
    } else {
      console.log(" No errors found in last 24h")
    }
    console.log()

    // Test 8: Cleanup
    console.log("8. Cleaning up test data...")
    const testIds = [testExecutionId, errorExecutionId, latencyExecutionId]
    for (const id of testIds) {
      await supabase
        .from("automation_logs")
        .delete()
        .eq("execution_id", id)
    }
    console.log(" Test data cleaned up\n")

    console.log("============================")
    console.log(" All tests passed!")
    console.log("\nMonitoring system is ready to use:")
    console.log("- API endpoint: POST /automation/classify")
    console.log("- Execution logs: GET /monitoring/execution/{executionId}")
    console.log("- Latency stats: GET /monitoring/latency")
    console.log("- Error stats: GET /monitoring/errors")
    console.log("- Fallback stats: GET /monitoring/fallbacks")
  } catch (error) {
    console.error(" Unexpected error:", error)
  }
}

testMonitoring()
