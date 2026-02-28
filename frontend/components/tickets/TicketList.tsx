'use client'

type Ticket = {
  id: string
  title: string
  status: string
}

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  if (!tickets.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-gray-500 text-sm">
        No tickets found
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <ul className="divide-y divide-gray-100">
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <span className="font-medium text-gray-800">
              {ticket.title}
            </span>

            <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-600">
              {ticket.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
