
jest.mock('../automation/ai/provider', () => ({
  callAI: jest.fn()
}))

import { callAI } from '../automation/ai/provider'
import { classifyTicket } from '../automation/ai/classifier'
import { buildClassificationPrompt } from '../automation/ai/prompt-builder'


describe('AI Classification TDD', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('classifies urgent server issue as high priority', async () => {
    (callAI as jest.Mock).mockResolvedValue(
      JSON.stringify({
        priority: "high",
        category: "incident",
        confidence: 0.92
      })
    )

    const result = await classifyTicket("Server down urgent", "")

    expect(result.priority).toBe("high")
  })

  it('rejects invalid JSON response', async () => {

    (callAI as jest.Mock).mockResolvedValue("invalid-json")

    await expect(
      classifyTicket("broken", "")
    ).rejects.toThrow("Invalid AI response")
  })

  it('applies fallback when confidence is low', async () => {
    (callAI as jest.Mock).mockResolvedValue(
      JSON.stringify({
        priority: "low",
        category: "general",
        confidence: 0.4
      })
    )

    const result = await classifyTicket("minor typo", "")

    expect(result.priority).toBe("medium")
    expect(result.category).toBe("general")
  })

  it("prompt structure should remain stable", () => {
    const prompt = buildClassificationPrompt({
      title: "Server down urgent",
      description: "Production is offline"
    })

    expect(prompt).toMatchSnapshot()
  })
    it("rejects schema violations", async () => {
    
      (callAI as jest.Mock).mockResolvedValue(
        JSON.stringify({
          priority: "urgent", // invalid enum
          category: "incident",
          confidence: 0.9
        })
      )
    
      await expect(
        classifyTicket("Server down", "")
      ).rejects.toThrow("Invalid AI response")
    
    })
})