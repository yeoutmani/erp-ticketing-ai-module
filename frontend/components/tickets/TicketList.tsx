'use client'

type Ticket = {
  id: string
  title: string
  status: string
}

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  if (!tickets.length) {
    return <p>No tickets found</p>
  }

  return (
    <ul>
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          {ticket.title} - {ticket.status}
        </li>
      ))}
    </ul>
  )
}
