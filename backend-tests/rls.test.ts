import { createAnonClient, createServiceClient } from './setup'

describe('RLS Multi-Tenant Isolation', () => {

  const service = createServiceClient()
  const anon = createAnonClient()

  let orgA: string
  let orgB: string
  let userAId: string
  let userBId: string

  beforeAll(async () => {
    // Get users from auth
    const users = await service.auth.admin.listUsers()

    userAId = users.data.users[0].id
    userBId = users.data.users[1].id

    // Create org A
    const { data: orgAData } = await service
      .from('organizations')
      .insert({ name: 'Org A' })
      .select()
      .single()

    orgA = orgAData.id

    // Create org B
    const { data: orgBData } = await service
      .from('organizations')
      .insert({ name: 'Org B' })
      .select()
      .single()

    orgB = orgBData.id

    // Map users
    await service.from('user_organizations').insert([
      { user_id: userAId, org_id: orgA },
      { user_id: userBId, org_id: orgB }
    ])

    // Insert tickets
    await service.from('tickets').insert([
      { org_id: orgA, user_id: userAId, title: 'Ticket A' },
      { org_id: orgB, user_id: userBId, title: 'Ticket B' }
    ])
  })

  it('User A should only see Org A tickets', async () => {
    await anon.auth.signInWithPassword({
      email: 'userA@test.com',
      password: 'yourpassword'
    })

    const { data } = await anon.from('tickets').select('*')

    expect(data?.length).toBe(1)
    expect(data?.[0].title).toBe('Ticket A')
  })

  it('User B should only see Org B tickets', async () => {
    await anon.auth.signInWithPassword({
      email: 'userB@test.com',
      password: 'yourpassword'
    })

    const { data } = await anon.from('tickets').select('*')

    expect(data?.length).toBe(1)
    expect(data?.[0].title).toBe('Ticket B')
  })

})