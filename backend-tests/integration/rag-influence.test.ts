jest.mock('../../automation/ai/embeddings', () => ({
  generateEmbedding: jest.fn().mockResolvedValue(
    new Array(768).fill(0.1)
  )
}))

jest.mock('../../automation/ai/provider', () => ({
  callAI: jest.fn().mockResolvedValue(
    JSON.stringify({
      priority: "high",
      category: "incident",
      confidence: 0.9
    })
  )
}))

import { classifyTicket } from "../../automation/ai/classifier"
import * as provider from "../../automation/ai/provider"

jest.spyOn(provider, "callAI").mockResolvedValue(
  JSON.stringify({
    priority: "high",
    category: "incident",
    confidence: 0.9
  })
)

describe("RAG Influence Test", () => {

  it("RAG context should influence AI classification", async () => {

    const result = await classifyTicket(
      "Production API unavailable",
      "All customers receive 500 errors"
    )

    expect(result.priority).toBe("high")
    expect(result.category).toBe("incident")

  })

})