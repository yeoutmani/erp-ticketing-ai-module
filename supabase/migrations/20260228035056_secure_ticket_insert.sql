-- ============================================
-- Auto-fill org_id and user_id before insert
-- ============================================

-- Create trigger function
create or replace function set_ticket_context()
returns trigger as $$
begin
  -- Set user_id automatically
  new.user_id := auth.uid();

  -- Get org_id from mapping table
  select org_id
  into new.org_id
  from user_organizations
  where user_id = auth.uid()
  limit 1;

  if new.org_id is null then
    raise exception 'User is not linked to any organization';
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to tickets table
drop trigger if exists set_ticket_context_trigger on tickets;

create trigger set_ticket_context_trigger
before insert on tickets
for each row
execute function set_ticket_context();