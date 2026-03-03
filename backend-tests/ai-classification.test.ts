import { classifyTicket } from '../automation/ai/classifier'

describe('AI Classification TDD', () => {

  it('classifies urgent server issue as high priority', async () => {
    const result = await classifyTicket("Server down urgent")

    expect(result.priority).toBe('high')
  })

  it('rejects invalid JSON response', async () => {
    await expect(
      classifyTicket("invalid-json-test")
    ).rejects.toThrow('Invalid AI response')
  })

  it('applies fallback when confidence is low', async () => {
    const result = await classifyTicket("minor typo in footer")

    expect(result.priority).toBe('medium')
    expect(result.category).toBe('general')
  })

})