import { render, screen } from '@testing-library/react'
import TicketList from '@/components/tickets/TicketList'

describe('TicketList', () => {
  it('renders tickets correctly', () => {
    const mockTickets = [
      { id: '1', title: 'Server down', status: 'open' },
      { id: '2', title: 'Bug login', status: 'closed' }
    ]

    render(<TicketList tickets={mockTickets} />)

    expect(screen.getByText('Server down - open')).toBeInTheDocument()
    expect(screen.getByText('Bug login - closed')).toBeInTheDocument()
  })

  it('renders empty state when no tickets', () => {
    render(<TicketList tickets={[]} />)

    expect(screen.getByText('No tickets found')).toBeInTheDocument()
  })
})
