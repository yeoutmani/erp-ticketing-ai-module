'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [tickets, setTickets] = useState<any[]>([])

  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')

      if (error) {
        console.error(error)
      } else {
        setTickets(data || [])
      }
    }

    fetchTickets()
  }, [])

  return (
    <main>
      <h1>Tickets</h1>
      <pre>{JSON.stringify(tickets, null, 2)}</pre>
    </main>
  )
}