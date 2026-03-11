
-- Add new columns for comprehensive monitoring (if they don't exist)
alter table automation_logs
  add column if not exists execution_id text,
  add column if not exists event_type text,
  add column if not exists event_data jsonb default '{}',
  add column if not exists timestamp timestamp with time zone default now();

-- Add constraint for status values
do $$
begin
  alter table automation_logs
    add constraint automation_logs_status_check 
    check (status in ('success', 'error'));
exception when duplicate_object then
  null;
end $$;

-- Create indexes for efficient querying
create index if not exists idx_automation_logs_execution_id on automation_logs(execution_id);
create index if not exists idx_automation_logs_ticket_id on automation_logs(ticket_id);
create index if not exists idx_automation_logs_event_type on automation_logs(event_type);
create index if not exists idx_automation_logs_status on automation_logs(status);
create index if not exists idx_automation_logs_timestamp on automation_logs(timestamp);
create index if not exists idx_automation_logs_execution_timestamp on automation_logs(execution_id, timestamp);
create index if not exists idx_automation_logs_event_type_timestamp on automation_logs(event_type, timestamp);
create index if not exists idx_automation_logs_status_timestamp on automation_logs(status, timestamp);

-- Add comments for clarity
comment on table automation_logs is 'Logs all automation workflow events for monitoring, debugging, and analytics';
comment on column automation_logs.execution_id is 'Unique identifier for tracking a complete workflow execution';
comment on column automation_logs.event_type is 'Type of event: TICKET_CREATED, AI_LATENCY, AI_FAILURE, WEBHOOK_EXECUTION, FALLBACK_USAGE';
comment on column automation_logs.event_data is 'Event-specific data in JSON format';
comment on column automation_logs.status is 'Whether the event was successful or failed';
comment on column automation_logs.error is 'Error message if status is error';
comment on column automation_logs.timestamp is 'Timestamp of the event';
