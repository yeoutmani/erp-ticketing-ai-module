import ollama from "ollama"

export interface AIProvider {
  call(prompt: string): Promise<string>
}

export async function callAI(prompt: string): Promise<string> {

  const response = await ollama.chat({
    model: "llama3",
    messages: [
      { role: "user", content: prompt }
    ]
  })

  return response.message.content
}