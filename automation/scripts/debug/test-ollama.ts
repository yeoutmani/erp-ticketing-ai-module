import { ollama } from "../../ai/ollama-client" 

async function test() {

  const res = await ollama.chat({
    model: "llama3",
    messages: [
      { role: "user", content: "Say hello" }
    ]
  })

  console.log(res)

}

test()