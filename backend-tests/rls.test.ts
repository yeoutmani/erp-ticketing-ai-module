import { createAnonClient, createServiceClient } from './setup'

describe('RLS Multi-Tenant Isolation', () => {
  const service = createServiceClient()

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

    userAId = userAData!.user!.id

    // Create User B
    const { data: userBData } = await service.auth.admin.createUser({
      email: `userB-${unique}@test.com`,
      password: 'password123',
      email_confirm: true
    })

    userBId = userBData!.user!.id

    // Create orgs
    const { data: orgAData } = await service
      .from('organizations')
      .insert({ name: 'Org A' })
      .select()
      .single()

    orgA = orgAData!.id

    const { data: orgBData } = await service
      .from('organizations')
      .insert({ name: 'Org B' })
      .select()
      .single()

    orgB = orgBData!.id

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
    const client = createAnonClient()

    await client.auth.signInWithPassword({
      email: `userA-${unique}@test.com`,
      password: 'password123'
    })

    const { data } = await client.from('tickets').select('*')

    expect(data?.map(t => t.title)).toEqual(['Ticket A'])
    expect(data?.some(t => t.title === 'Ticket B')).toBe(false)
  })

  it('User B should only see Org B tickets', async () => {
    const client = createAnonClient()

    await client.auth.signInWithPassword({
      email: `userB-${unique}@test.com`,
      password: 'password123'
    })

    const { data } = await client.from('tickets').select('*')

    expect(data?.map(t => t.title)).toEqual(['Ticket B'])
  })

  it('User A cannot query Org B tickets explicitly', async () => {
    const client = createAnonClient()

    await client.auth.signInWithPassword({
      email: `userA-${unique}@test.com`,
      password: 'password123'
    })

    const { data } = await client
      .from('tickets')
      .select('*')
      .eq('org_id', orgB)

    expect(data?.length).toBe(0)
  })

  afterAll(async () => {
    await service.from('tickets').delete().neq('id', '')
    await service.from('user_organizations').delete().neq('user_id', '')
    await service.from('organizations').delete().neq('id', '')
  })
})