-- Knowledge base table for RAG

create table knowledge_base (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(1536) not null,
  category text,
  created_at timestamptz default now()
);

-- Vector similarity index (cosine distance)
create index if not exists knowledge_base_embedding_idx
on knowledge_base
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Update planner statistics
analyze knowledge_base;