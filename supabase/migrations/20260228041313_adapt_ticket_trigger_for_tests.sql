-- ============================================
-- Adapt ticket trigger to support service role seeding
-- ============================================

create or replace function set_ticket_context()
returns trigger as $$
begin
  -- If authenticated user context exists (normal app usage)
  if auth.uid() is not null then

    -- Force user_id to authenticated user
    new.user_id := auth.uid();

    -- Resolve org_id from mapping table
    select org_id
    into new.org_id
    from user_organizations
    where user_id = auth.uid()
    limit 1;

    if new.org_id is null then
      raise exception 'User is not linked to any organization';
    end if;

  end if;

  -- If auth.uid() is NULL (service role / backend tests),
  -- do not override provided org_id and user_id.
  return new;
end;
$$ language plpgsql security definer;

-- Ensure trigger exists
drop trigger if exists set_ticket_context_trigger on tickets;

create trigger set_ticket_context_trigger
before insert on tickets
for each row
execute function set_ticket_context();