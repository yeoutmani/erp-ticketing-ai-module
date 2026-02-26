create index idx_tickets_org_id on tickets(org_id);
create index idx_tickets_status on tickets(status);
create index idx_tickets_created_at on tickets(created_at);
create index idx_tickets_org_status on tickets(org_id, status);