# 🚀 AI-Powered ERP Ticketing Module (SaaS-Ready)

Production-grade multi-tenant Ticketing SAV system powered by AI (RAG), Supabase, and workflow automation.

---

## 🚀 Live Demo

👉 https://erp.qimora.app/

### Demo Credentials
- Email: userb-1772581582917@test.com  
- Password: password123  

---

## 🎯 Overview

This project demonstrates a real-world SaaS architecture for a ticketing system enhanced with AI classification and automation.

It is designed with production constraints in mind:

- Multi-tenant isolation (Row Level Security)
- AI-powered ticket classification (RAG)
- Workflow automation (n8n)
- Observability & monitoring
- Fault tolerance with fallback strategies

---

## 💡 Business Value

- 🚀 Reduce support response time via automatic ticket prioritization  
- 🤖 Automate repetitive support workflows  
- 📊 Improve ticket categorization accuracy using AI  
- 🏢 Enable scalable SaaS multi-tenant architecture  
- 💰 Cost-aware AI usage with fallback strategies  

---

## 🧠 Key Features

- 🔐 Multi-tenant architecture (PostgreSQL + RLS)
- 🤖 AI classification (priority + category)
- 📚 RAG pipeline (pgvector + contextual retrieval)
- ⚙️ Workflow automation with n8n
- 📡 Monitoring & observability
- 🛡️ Guardrails & fallback logic
- ⚡ Realtime updates via Supabase

---

## 🏗️ Architecture

### Stack

- Frontend: React + TypeScript  
- Backend: Supabase (Auth, Postgres, RLS, Realtime)  
- AI Service: Node.js (Express)  
- Automation: n8n  
- AI: Ollama + optional OpenAI fallback  
- Vector DB: pgvector  

---

### 🔄 System Flow

1. User creates a ticket (React UI)
2. Ticket stored in Supabase (RLS enforced)
3. Edge Function triggers n8n webhook
4. n8n calls AI classification service
5. AI (RAG) returns structured result
6. Ticket updated automatically
7. Fallback applied if AI fails

---

## 🤖 AI Classification (RAG)

- Context retrieval from historical tickets + documentation  
- Embeddings stored via pgvector  
- Strict structured output enforcement  

### Output format:

{
  "priority": "high | medium | low",
  "category": "technical | billing | bug | other",
  "confidence": 0.92
}

---

## 🛡️ Guardrails

- Context-limited retrieval  
- Output schema validation  
- Confidence threshold  
- Timeout handling  
- Rule-based fallback system  

---

## 📊 Monitoring & Observability

- AI latency tracking  
- Error distribution  
- Fallback usage analysis  
- Execution timeline debugging  
- Supabase logs + n8n execution logs  

---

## 🔌 API Endpoints

POST /automation/classify

GET /monitoring/execution/:executionId  
GET /monitoring/latency  
GET /monitoring/errors  
GET /monitoring/fallbacks  

GET /health

---

## ⚡ Quick Start (TL;DR)

git clone
cd project

cp frontend/.env.example frontend/.env.local
cp automation/.env.example automation/.env

docker compose -f automation/docker-compose.yml up -d

cd automation && npm install && npm run dev
cd frontend && npm install && npm run dev -- -p 3001

---

## 🔐 Multi-Tenant Security (RLS)

- Each ticket scoped by org_id  
- Full isolation at database level  
- No cross-tenant access possible  

---

## 🚀 Deployment

- Dockerized services  
- Environment-based configuration  
- Versioned DB migrations  
- Staging / Production separation  

---

## 👨‍💻 Author

Yassine El Outmani  
Senior Full-Stack Engineer – AI & Data Systems  

Morocco – Open to international & remote opportunities  
