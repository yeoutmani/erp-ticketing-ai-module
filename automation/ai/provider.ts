export interface AIProvider {
  call(prompt: string): Promise<string>
}

export async function callAI(prompt: string): Promise<string> {
  throw new Error("AI provider not configured")
}