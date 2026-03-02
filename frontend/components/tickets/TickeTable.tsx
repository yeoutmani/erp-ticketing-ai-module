'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabaseClient'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Ticket = {
  id: string
  title: string
  status: string
  priority?: string
  category?: string
  created_at?: string
}

export default function TicketTable({ tickets }: { tickets: Ticket[] }) {
  const [data, setData] = useState<Ticket[]>(tickets)
  const [recentlyUpdated, setRecentlyUpdated] = useState<string | null>(null)

  // Sync if SSR changes
  useEffect(() => {
    setData(tickets)
  }, [tickets])

  // Realtime subscription
  useEffect(() => {
    const channel = supabaseClient
      .channel('tickets-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        (payload) => {
          // INSERT
          if (payload.eventType === 'INSERT') {
            const newTicket = payload.new as Ticket

            setData(prev => {
              // prevent duplicates
              if (prev.some(t => t.id === newTicket.id)) return prev
              return [newTicket, ...prev]
            })
          }

          // UPDATE
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Ticket

            setData(prev =>
              prev.map(ticket =>
                ticket.id === updated.id ? updated : ticket
              )
            )

            setRecentlyUpdated(updated.id)
            setTimeout(() => setRecentlyUpdated(null), 1500)
          }

          // DELETE
          if (payload.eventType === 'DELETE') {
            const removed = payload.old as Ticket

            setData(prev =>
              prev.filter(ticket => ticket.id !== removed.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [])

  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-gray-500 text-sm">
        No tickets found
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-400">
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((ticket, index) => (
            <TableRow
              key={ticket.id}
              className={`
                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                ${ticket.id === recentlyUpdated ? 'bg-yellow-50 transition-colors duration-500' : ''}
                hover:bg-gray-100 transition-colors
              `}
            >
              <TableCell className="font-medium text-gray-800">
                {ticket.title}
              </TableCell>

              <TableCell className="text-gray-600">
                {ticket.status}
              </TableCell>

              <TableCell>
                <PriorityBadge value={ticket.priority} />
              </TableCell>

              <TableCell className="text-gray-600">
                {ticket.category ?? '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function PriorityBadge({ value }: { value?: string }) {
  const colors: Record<string, string> = {
    high: 'bg-red-100 text-red-600',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-600'
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        colors[value ?? ''] || 'bg-gray-100 text-gray-600'
      }`}
    >
      {value ?? '—'}
    </span>
  )
}