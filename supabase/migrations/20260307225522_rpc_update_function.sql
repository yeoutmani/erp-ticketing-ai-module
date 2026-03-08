create or replace function match_knowledge(
  query_embedding vector(768),
  match_count int default 5
)
returns table (
  id uuid,
  content text,
  category text,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    category,
    1 - (embedding <=> query_embedding::vector) as similarity
  from knowledge_base
  order by embedding <=> query_embedding::vector
  limit match_count;
$$;