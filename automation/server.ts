import express from "express"
import { classifyTicket } from "./ai/classifier"

const app = express()

app.use(express.json())

app.post("/automation/classify", async (req, res) => {

  try {

    const { title, description } = req.body

    const result = await classifyTicket(title, description)

    res.json(result)

  } catch (error) {

    console.error("Classification error:", error)

    res.status(500).json({
      error: "classification_failed"
    })

  }

})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Automation API running on port ${PORT}`)
})