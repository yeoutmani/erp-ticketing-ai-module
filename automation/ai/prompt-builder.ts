export function buildClassificationPrompt(params: {
  title: string
  description: string
  context?: string
}) {
    return `
        You are an AI system responsible for classifying SAV support tickets.

        You MUST return ONLY valid JSON.
        Do NOT include explanations, comments, or markdown.

        Allowed priority values:
        - high
        - medium
        - low

        Allowed category values:
        - incident
        - billing
        - technical
        - feature
        - general

        Output JSON format:
        {
          "priority": "high | medium | low",
          "category": "incident | billing | technical | feature | general",
          "confidence": number between 0 and 1
        }

        Use the historical SAV tickets below as reference examples.

        Historical SAV context:
        ${params.context ?? "No relevant historical tickets."}

        Now classify the following ticket.

        Ticket:
        Title: ${params.title}
        Description: ${params.description}

        Return structured JSON only.
      `
  }