-- SELECT policy
create policy "tenant_select"
on tickets
for select
using (
  org_id in (
    select org_id
    from user_organizations
    where user_id = auth.uid()
  )
);

-- INSERT policy
create policy "tenant_insert"
on tickets
for insert
with check (
  org_id in (
    select org_id
    from user_organizations
    where user_id = auth.uid()
  )
);

-- UPDATE policy
create policy "tenant_update"
on tickets
for update
using (
  org_id in (
    select org_id
    from user_organizations
    where user_id = auth.uid()
  )
);

-- DELETE policy
create policy "tenant_delete"
on tickets
for delete
using (
  org_id in (
    select org_id
    from user_organizations
    where user_id = auth.uid()
  )
);