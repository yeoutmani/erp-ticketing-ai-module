import ollama from "ollama"

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