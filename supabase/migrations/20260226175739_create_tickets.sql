create extension if not exists "pgcrypto";

create table tickets (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  user_id uuid not null,
  title text not null,
  description text,
  status text default 'open',
  priority text,
  category text,
  created_at timestamptz default now()
);