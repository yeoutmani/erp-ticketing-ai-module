import express from "express"
import { generateEmbedding } from "./ai/embeddings"

const app = express()

app.use(express.json())

app.post("/automation/embedding", async (req, res) => {
  try {

    const { title, description } = req.body

    const embedding = await generateEmbedding(`${title} ${description}`)

    res.json({
      embedding
    })

  } catch (error) {

    console.error("Embedding error:", error)

    res.status(500).json({
      error: "embedding_failed"
    })
  }
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Automation API running on port ${PORT}`)
})