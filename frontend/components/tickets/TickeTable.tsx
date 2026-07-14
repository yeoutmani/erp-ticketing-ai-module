'use client'

import { useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabaseClient"
import StatusBadge from "@/components/ui/status-badge"
import TicketSearch from "@/components/tickets/TicketSearch"
import { useToast } from "@/components/ui/toast"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import PriorityBadge from "@/components/ui/priority-badge"
import { Ticket } from "@/types/ticket"

export default function TicketTable({ tickets }: { tickets: Ticket[] }) {

  const [data, setData] = useState<Ticket[]>(tickets)
  const [recentlyUpdated, setRecentlyUpdated] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const { addToast } = useToast()
  const filteredTickets = data.filter((ticket) =>
    ticket.title.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    setData(tickets)
  }, [tickets])

  useEffect(() => {
    const channel = supabaseClient
      .channel("tickets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tickets" },
        (payload) => {

          if (payload.eventType === "INSERT") {
            const newTicket = payload.new as Ticket
            setData(prev => [newTicket, ...prev])
            addToast("New ticket created", "info")
          }

          if (payload.eventType === "UPDATE") {
            const updated = payload.new as Ticket

            setData(prev =>
              prev.map(ticket =>
                ticket.id === updated.id ? updated : ticket
              )
            )

            setRecentlyUpdated(updated.id)
            addToast("Ticket updated", "info")
            setTimeout(() => setRecentlyUpdated(null), 1500)
          }

          if (payload.eventType === "DELETE") {
            const removed = payload.old as Ticket
            setData(prev => prev.filter(t => t.id !== removed.id))
            addToast("Ticket deleted", "info")
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
      <Card>
        <p className="text-sm text-muted-foreground">No tickets found</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

          <div className="flex items-center justify-between">

            <h3 className="text-sm text-muted-foreground">
              {filteredTickets.length} tickets
            </h3>

            <TicketSearch value={search} onChange={setSearch} />

          </div>
        <Table>

          <TableHeader>
            <TableRow className="border-b bg-muted/20">

              <TableHead className="font-medium">
                Title
              </TableHead>

              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Category</TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTickets.map(ticket => (

              <TableRow
                  key={ticket.id}
                  className="
                    hover:bg-muted/50 
                    transition-colors
                    duration-200
                  "
              >

                <TableCell className="font-medium">
                  {ticket.title}
                </TableCell>

                <TableCell>
                  <StatusBadge value={ticket.status} />
                </TableCell>

                <TableCell>
                  <PriorityBadge value={ticket.priority} />
                </TableCell>

                <TableCell>
                  {ticket.category ?? "—"}
                </TableCell>

              </TableRow>

            ))}
          </TableBody>

        </Table>

      </CardContent>
    </Card>
  )
}