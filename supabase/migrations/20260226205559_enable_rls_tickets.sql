-- Enable Row Level Security on tickets table
alter table tickets enable row level security;

-- Force RLS even for table owner
alter table tickets force row level security;