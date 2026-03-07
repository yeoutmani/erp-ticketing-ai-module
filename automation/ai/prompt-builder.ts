export function buildClassificationPrompt(params: {
  title: string
  description: string
  context?: string
}) {
    return `
        You are a ticket classification engine.

        You MUST return ONLY valid JSON.
        Do NOT include explanations.

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

        Output format:
        {
        "priority": "high | medium | low",
        "category": "incident | billing | technical | feature | general",
        "confidence": number between 0 and 1
        }

        Context:
        ${params.context ?? "None"}

        Ticket:
        Title: ${params.title}
        Description: ${params.description}

        Classify this ticket.
        Return structured JSON only.
        `
    }