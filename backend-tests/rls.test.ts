import { createTestClient } from './setup'

describe('RLS TDD – Multi-Tenant Isolation', () => {

  it('should fail because RLS is not enforced yet', async () => {
    const client = createTestClient()

    const { data, error } = await client
      .from('tickets')
      .select('*')

    expect(error).toBeNull()

    // ❌ This should fail if more than 1 ticket visible
    expect(data?.length).toBe(1)
  })

})