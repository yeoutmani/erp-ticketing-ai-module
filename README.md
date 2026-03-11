# ERP Ticketing SAV – AI-Enabled Module

A production-style mini ERP module demonstrating a secure multi-tenant Ticketing SAV system powered by Supabase, React, n8n automation, and AI classification (RAG-based).

---

## Documentation

- **Architecture (diagram, RLS, AI/RAG, n8n, deployment, security, decisions)**: see `ARCHITECTURE.md`

---

## Overview

This project implements a scalable and secure SaaS-ready ticketing module including:

- Multi-tenant PostgreSQL database with Row Level Security (RLS)
- React frontend (ticket list + creation)
- n8n workflow automation
- AI-based ticket classification (priority + category)
- Retrieval-Augmented Generation (RAG) to reduce hallucinations
- Fallback logic & monitoring

---

## Run locally (development)

### Prerequisites

- Node.js + npm
- Docker (for n8n)
- A Supabase project (URL + keys)

### 1) Configure environment variables

```bash
# Frontend (Next.js)
cp frontend/.env.exemple frontend/.env.local

# Automation (AI service + n8n)
cp automation/.env.example automation/.env
```

Update the values inside:
- `frontend/.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `automation/.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `N8N_ENCRYPTION_KEY`, basic auth credentials, etc.

### 2) Start n8n (Docker)

```bash
docker compose -f automation/docker-compose.yml --env-file automation/.env up -d
```

n8n will be available at `http://localhost:5678` (by default).

### 3) Start the AI service (automation API)

```bash
cd automation
npm install
npm run dev
```

This service currently listens on `http://localhost:3000` and exposes:
- `POST /automation/classify`
- `GET /monitoring/*`
- `GET /health`

### 4) Start the frontend (Next.js)

The AI service uses port `3000`, so run Next.js on a different port:

```bash
cd frontend
npm install
npm run dev -- -p 3001
```

Open `http://localhost:3001`.

---

## Architecture

### Stack

- **Frontend**: React + TypeScript
- **Backend**: Supabase (Auth + Postgres + RLS + Realtime) + AI service (Node/Express)
- **Automation**: n8n
- **AI**: RAG using `pgvector`; Ollama as primary inference with optional OpenAI fallback

### Flow

1. User creates a ticket from the React UI.
2. Ticket is stored in Supabase (RLS enforced).
3. An Edge Function triggers a webhook to n8n.
4. n8n calls the AI service (RAG-based classification).
5. AI returns structured JSON (priority, category).
6. Ticket is updated automatically.
7. Fallback logic is applied if AI fails.

---

## Multi-Tenant Security (RLS)

Each ticket belongs to an `org_id`.

Row Level Security policies ensure:

 - Users can only access tickets within their organization.
 - Insert and update operations are restricted by org context.
 - Isolation enforced at database level (not only in frontend).

---

## AI Classification (RAG)

- Embeddings stored using pgvector.
- Retrieval limited to historical SAV tickets and validated documentation.
- Prompt enforces strict structured JSON output:

```json
{
  "priority": "high | medium | low",
  "category": "technical | billing | bug | other"
}
```

---

## Guardrails

- Context-limited retrieval
- Structured output validation
- Confidence threshold
- Rule-based fallback if AI fails or times out

---

## n8n Workflow

- Webhook trigger on ticket creation
- AI classification call
- Update ticket via Supabase REST API
- Error handling & logging
- Environment separation (staging / production)

---

## Testing Strategy

- RLS validation with multiple organization users
- API integration tests
- React tests (React Testing Library)
- Workflow testing in staging environment
- AI output schema validation

---

## Monitoring & Observability

- Supabase logs
- AI latency & error monitoring
- Token usage tracking
- n8n execution logs

---

## Deployment

- Dockerized services
- Environment-based configuration (`.env.example` included)
- Versioned database migrations
- Staging & production separation

---

## Project Goals

This project demonstrates:

- SaaS multi-tenant architecture
- Secure data isolation (RLS)
- Workflow automation
- AI integration with guardrails
- Cost-aware production design

---

## Test Strategy

### Unit Tests

- AI classification logic
- JSON schema validation
- fallback behavior
- timeout handling
- prompt regression tests

### Integration Tests

- AI classify API endpoint
- RAG context influence
- Supabase Row Level Security multi-tenant isolation

### End-to-End Validation

- Ticket creation triggers webhook
- n8n automation pipeline execution
- AI classification response handling
- Ticket update in database

### Debug Scripts

- embedding generation
- prompt builder
- ollama provider
- retrieval pipeline

---

## Author

Yassine El Outmani  
Senior Full-Stack Engineer – AI & Data Systems  
Morocco – Open to international & national opportunities
