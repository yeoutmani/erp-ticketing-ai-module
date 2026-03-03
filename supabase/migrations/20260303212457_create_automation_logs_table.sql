create table automation_logs (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid,
  latency_ms integer,
  execution_finished_at timestamptz,
  status text,
  created_at timestamptz default now()
);