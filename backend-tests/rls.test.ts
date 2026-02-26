import { createAnonClient, createServiceClient } from './setup'

describe('RLS Multi-Tenant Isolation', () => {

  const service = createServiceClient()
  const anon = createAnonClient()

  let orgA: string
  let orgB: string
  let userAId: string
  let userBId: string
  const unique = Date.now()

  beforeAll(async () => {
    // Create User A
    const { data: userAData } = await service.auth.admin.createUser({
    email: `userA-${unique}@test.com`,
    password: 'password123',
    email_confirm: true
    })

    userAId = userAData.user!.id

    // Create User B
    const { data: userBData } = await service.auth.admin.createUser({
    email: `userB-${unique}@test.com`,
    password: 'password123',
    email_confirm: true
    })

    userBId = userBData.user!.id

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
      email: `userA-${unique}@test.com`,
      password: 'password123'
    })

    const { data } = await anon.from('tickets').select('*')

    expect(data?.length).toBe(1)
    expect(data?.[0].title).toBe('Ticket A')
  })

  it('User B should only see Org B tickets', async () => {
    await anon.auth.signInWithPassword({
      email: `userB-${unique}@test.com`,
      password: 'password123'
    })

    const { data } = await anon.from('tickets').select('*')

    expect(data?.length).toBe(1)
    expect(data?.[0].title).toBe('Ticket B')
  })
    
  afterAll(async () => {
    await service.from('tickets').delete().neq('id', '')
    await service.from('user_organizations').delete().neq('user_id', '')
    await service.from('organizations').delete().neq('id', '')
  })

})