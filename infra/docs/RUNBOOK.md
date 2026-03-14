# Running Docker prod locally

## 1 — Check prerequisites

```bash
docker --version 
docker compose version
```

---

## 2 — Create your `.env` at project root

```bash
cp infra/.env.example .env
```

Then fill in the real values:

```dotenv
# Frontend
NEXT_PUBLIC_SUPABASE_URL=https://cxuztagwxmn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_m8m...

# Supabase server-side
SUPABASE_URL=https://cxuztagwxmn.supabase.co
SUPABASE_ANON_KEY=sb_publishable_m8m...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SUPABASE_PROJECT_REF=cxuztagwxmn
SUPABASE_ACCESS_TOKEN=sbp_...

# n8n
N8N_PORT=5678
N8N_HOST=0.0.0.0
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=        # openssl rand -hex 16
N8N_ENCRYPTION_KEY=             # openssl rand -hex 32
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
N8N_PATH=/n8n/
WEBHOOK_URL=http://localhost/n8n/

# AI
AI_TIMEOUT_MS=30000
AI_CONFIDENCE_THRESHOLD=0.75
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_CHAT_MODEL=llama3
OLLAMA_EMBED_MODEL=nomic-embed-text
```

---

## 3 — Run Supabase migrations first

```bash
supabase db push --project-ref cxuztagwxmn
```

---

## 4 — Build and start everything

```bash
docker compose up -d --build
```

This will:

- Build frontend, automation, nginx, ollama images
- Pull n8n image
- Start all containers
- Ollama will start downloading `llama3` (~4GB) in background

---

## 5 — Watch the logs

```bash
# All services
docker compose logs -f

# Ollama only (to track model download progress)
docker compose logs -f ollama

# One specific service
docker compose logs -f automation
```

---

## 6 — Wait for Ollama to finish pulling models

```bash
# Check when models are ready
docker compose exec ollama ollama list

# Expected when ready:
# NAME                    SIZE
# llama3:latest           4.7GB
# nomic-embed-text:latest 274MB

# Pull both models manually temporarily
docker compose exec ollama ollama pull llama3
docker compose exec ollama ollama pull nomic-embed-text
```

---

## 7 — Import n8n workflows

```bash
bash infra/scripts/seed-n8n.sh
```

---

## 8 — Verify all services are healthy

```bash
docker compose ps
```

Expected output:

```
NAME                  STATUS
demo-nginx-1          Up (healthy)
demo-frontend-1       Up (healthy)
demo-automation-1     Up (healthy)
demo-n8n-1            Up (healthy)
demo-ollama-1         Up (healthy)
```

---

## 9 — Test each endpoint

```bash
# Frontend
curl http://localhost/
# → HTML page

# AI service health
curl http://localhost/api/health
# → {"status":"healthy","timestamp":"..."}

# Test classification
curl -X POST http://localhost/api/automation/classify \
  -H "Content-Type: application/json" \
  -d '{"title":"Login error","description":"Cannot connect"}'
# → {"priority":"high","category":"technical","confidence":0.91}

# n8n UI
open http://localhost/n8n/
```

---

## Useful commands

```bash
# Stop everything (keeps volumes)
docker compose down

# Stop + delete all data (volumes too) — full reset
docker compose down -v

# Rebuild one service only
docker compose up -d --build automation

# Restart one service
docker compose restart automation

# Shell into a container
docker compose exec automation sh
docker compose exec ollama sh

# Check resource usage
docker stats
```

---

## Expected first boot timeline

```
0:00  → containers start
0:05  → nginx, frontend, automation, n8n are up
0:10  → ollama server starts
0:10  → llama3 download starts (~4GB, depends on your connection)
X:XX  → nomic-embed-text download starts (~274MB)
X+2   → all models ready, ollama marked healthy
X+2   → automation can now classify tickets
```

Everything except Ollama is ready in under a minute. The first boot is the slow one — after that models are cached in the `ollama_models` volume.
