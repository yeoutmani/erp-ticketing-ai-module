jest.mock('../../automation/ai/provider', () => ({
  callAI: jest.fn()
}))

import { callAI } from '../../automation/ai/provider'
import { classifyTicket } from '../../automation/ai/classifier'
import { buildClassificationPrompt } from '../../automation/ai/prompt-builder'

const mockAI = callAI as jest.MockedFunction<typeof callAI>

describe('AI Classification TDD', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('classifies urgent server issue as high priority', async () => {

    mockAI.mockResolvedValue(
      JSON.stringify({
        priority: "high",
        category: "incident",
        confidence: 0.92
      })
    )

    const result = await classifyTicket("Server down urgent", "")

    expect(mockAI).toHaveBeenCalledTimes(1)

    expect(result).toEqual({
      priority: "high",
      category: "incident",
      confidence: 0.92
    })
  })

  it('falls back when AI returns invalid JSON', async () => {

    mockAI.mockResolvedValue("invalid-json")

    const result = await classifyTicket("broken", "")

    expect(result).toEqual({
      priority: "medium",
      category: "general",
      confidence: 0
    })

    expect(mockAI).toHaveBeenCalledTimes(1)
  })

  it('rejects schema violations', async () => {

    mockAI.mockResolvedValue(
      JSON.stringify({
        priority: "urgent", // invalid enum
        category: "incident",
        confidence: 0.9
      })
    )

    const result = await classifyTicket("broken", "")

    expect(result).toEqual({
      priority: "medium",
      category: "general",
      confidence: 0
    })

  })

  it('applies fallback when confidence is low', async () => {

    mockAI.mockResolvedValue(
      JSON.stringify({
        priority: "low",
        category: "general",
        confidence: 0
      })
    )

    const result = await classifyTicket("minor typo", "")

    expect(result).toEqual({
      priority: "medium",
      category: "general",
      confidence: 0
    })
  })

  it('accepts classification when confidence is above threshold', async () => {

    mockAI.mockResolvedValue(
      JSON.stringify({
        priority: "low",
        category: "general",
        confidence: 0.75
      })
    )

    const result = await classifyTicket("small bug", "")

    expect(result).toEqual({
      priority: "low",
      category: "general",
      confidence: 0.75
    })
  })

  it("prompt structure should remain stable", () => {

    const prompt = buildClassificationPrompt({
      title: "Server down urgent",
      description: "Production is offline"
    })

    expect(prompt).toMatchSnapshot()
  })

  it("falls back when AI times out", async () => {

    mockAI.mockImplementation(
      () => new Promise(() => {})
    )

    const result = await classifyTicket("Server down urgent", "")

    expect(result.priority).toBe("high")
  })

  it("falls back when AI service fails", async () => {

    mockAI.mockRejectedValue(new Error("service unavailable"))

    const result = await classifyTicket("Server down urgent", "")

    expect(result.priority).toBe("high")
  })

  it("triggers fallback when AI confidence is below threshold", async () => {

    mockAI.mockResolvedValue(
      JSON.stringify({
        priority: "high",
        category: "incident",
        confidence: 0.60
      })
    )

    const result = await classifyTicket("Server down urgent", "")

    expect(result).toEqual({
      priority: "high",
      category: "technical",
      confidence: 0
    })

  })
})