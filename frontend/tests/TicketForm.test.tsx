import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TicketForm from '@/components/tickets/TicketForm'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn()
  })
}))

describe('TicketForm validation', () => {
  it('blocks submission when title is empty', async () => {
    render(<TicketForm />)

    const button = screen.getByRole('button', { name: /create ticket/i })

    await userEvent.click(button)

    expect(screen.getByText('Title is required')).toBeInTheDocument()
  })
})

describe('TicketForm error handling', () => {
  it('displays error message on failed request', async () => {
    render(<TicketForm />)

    const input = screen.getByPlaceholderText('Title')
    const button = screen.getByRole('button', { name: /create ticket/i })

    await userEvent.type(input, 'Valid title')
    await userEvent.click(button)

    expect(screen.getByText('Error occurred: Request failed')).toBeInTheDocument()
  })
})
