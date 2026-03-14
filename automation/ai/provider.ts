import { ollama } from "./ollama-client" 

export interface AIProvider {
  call(prompt: string): Promise<string>
}

export async function callAI(prompt: string): Promise<string> {
  const startTime = Date.now()

  try {
    const response = await ollama.chat({
      model: "llama3",
      messages: [
        { role: "user", content: prompt }
      ]
    })

    const duration = Date.now() - startTime
    console.log(`AI call completed in ${duration}ms`)

    return response.message.content
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`AI call failed after ${duration}ms:`, error)
    throw error
  }
}