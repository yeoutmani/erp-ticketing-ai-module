#!/bin/sh
set -e

CHAT_MODEL="${OLLAMA_CHAT_MODEL:-llama3}"
EMBED_MODEL="${OLLAMA_EMBED_MODEL:-nomic-embed-text}"

echo "Starting Ollama server..."
ollama serve &
SERVER_PID=$!

# Wait until Ollama API responds
echo "Waiting for Ollama to be ready..."
until curl -s http://localhost:11434/api/tags > /dev/null 2>&1; do
  sleep 1
done
echo "Ollama is ready"

# Pull chat model
echo "Pulling $CHAT_MODEL..."
if ollama list | grep -q "$CHAT_MODEL"; then
  echo "$CHAT_MODEL already exists, skipping"
else
  ollama pull "$CHAT_MODEL"
  echo "$CHAT_MODEL pulled"
fi

# Pull embedding model
echo "Pulling $EMBED_MODEL..."
if ollama list | grep -q "$EMBED_MODEL"; then
  echo "$EMBED_MODEL already exists, skipping"
else
  ollama pull "$EMBED_MODEL"
  echo "$EMBED_MODEL pulled"
fi

echo "All models ready"

# Keep the server running
wait $SERVER_PID