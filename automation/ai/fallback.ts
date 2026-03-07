export function fallbackClassification(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase()

  const highPriorityKeywords = ["urgent", "down", "crash"]
  const technicalKeywords = ["server", "database", "api", "system", "error"]

  const isHighPriority = highPriorityKeywords.some(k => text.includes(k))
  const isTechnical = technicalKeywords.some(k => text.includes(k))

  return {
    priority: isHighPriority ? "high" : "medium",
    category: isTechnical ? "technical" : "general",
    confidence: 0
  }
}