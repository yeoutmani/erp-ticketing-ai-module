import { buildClassificationPrompt } from "../../automation/ai/prompt-builder"

describe("AI Prompt Regression", () => {

  it("should keep prompt structure stable", () => {

    const prompt = buildClassificationPrompt({
      title: "Server down urgent",
      description: "Production API returns 500",
      context: "Historical incident: server outage"
    })

    expect(prompt).toMatchSnapshot()

  })

  it("prompt must enforce JSON output", () => {

    const prompt = buildClassificationPrompt({
      title: "Server down",
      description: "API error"
    })

    expect(prompt).toContain("ONLY valid JSON")

  })

})