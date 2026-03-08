import { buildClassificationPrompt } from "../../ai/prompt-builder"

const prompt = buildClassificationPrompt({
  title: "Server down urgent",
  description: "Production API returns 500",
  context: "- Server down production\n- API returning 500 error"
})

console.log(prompt)