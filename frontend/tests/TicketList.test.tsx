import { render, screen } from '@testing-library/react'
import TickeTable from '@/components/tickets/TickeTable'

describe('TickeTable', () => {
  it('renders tickets correctly', () => {
    const mockTickets = [
      { id: '1', title: 'Server down', status: 'open' },
      { id: '2', title: 'Bug login', status: 'closed' }
    ]

    render(<TickeTable tickets={mockTickets} />)

    expect(screen.getByText(/server down/i)).toBeInTheDocument()
    expect(screen.getByText(/open/i)).toBeInTheDocument()
    expect(screen.getByText(/bug login/i)).toBeInTheDocument()
    expect(screen.getByText(/closed/i)).toBeInTheDocument()
  })

  it('renders empty state when no tickets', () => {
    render(<TickeTable tickets={[]} />)

    expect(screen.getByText('No tickets found')).toBeInTheDocument()
  })
})
