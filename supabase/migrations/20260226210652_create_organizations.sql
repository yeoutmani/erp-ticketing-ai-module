create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table user_organizations (
  user_id uuid references auth.users(id) on delete cascade,
  org_id uuid references organizations(id) on delete cascade,
  primary key (user_id, org_id)
);