import { Ollama } from "ollama"
import { OLLAMA_BASE_URL } from "./config"

export const ollama = new Ollama({
  host: OLLAMA_BASE_URL
})