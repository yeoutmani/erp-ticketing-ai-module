import { z } from "zod"

export const ClassificationSchema = z.object({
  priority: z.enum(["high", "medium", "low"]),
  category: z.enum([
    "incident",
    "billing",
    "technical",
    "feature",
    "general"
  ]),
  confidence: z.number().min(0).max(1),
})

export type Classification = z.infer<typeof ClassificationSchema>