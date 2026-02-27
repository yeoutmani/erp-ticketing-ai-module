import { createSupabaseServer } from '@/lib/supabaseServer'

export default async function TicketsPage() {
  const supabase = await createSupabaseServer()
  const { data: tickets, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p>Error loading tickets</p>
  }

  return (
    <div>
      <h1>Tickets</h1>
      <ul>
        {tickets?.map((ticket) => (
          <li key={ticket.id}>
            {ticket.title} - {ticket.status}
          </li>
        ))}
      </ul>
    </div>
  )
}