# ERP Ticketing SAV – AI-Enabled Module

A production-style mini ERP module demonstrating a secure multi-tenant Ticketing SAV system powered by Supabase, React, n8n automation, and AI classification (RAG-based).

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

## Architecture

### Stack

- **Supabase** – PostgreSQL, Auth, RLS
- **React** – UI (list + creation)
- **n8n** – Workflow automation
- **LLM (Ollama / OpenAI)** – AI classification
- **pgvector** – Embeddings storage

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

##  Monitoring & Observability

- Supabase logs
- AI latency & error monitoring
- Token usage tracking
- n8n execution logs

---

##  Deployment

- Dockerized services
- Environment-based configuration (.env.example included)
- Versioned database migrations
- Staging & production separation

---

##  Project Goals

This project demonstrates:
- SaaS multi-tenant architecture
- Secure data isolation (RLS)
- Workflow automation
- AI integration with guardrails
- Cost-aware production design

---

##  Author

Yassine El Outmani
Senior Full-Stack Engineer – AI & Data Systems
Morocco – Open to international & national opportunities