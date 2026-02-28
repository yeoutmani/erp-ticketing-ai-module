import TicketList from '@/components/tickets/TicketList'
import { createSupabaseServer } from '@/lib/supabaseServer'
import TicketForm from '@/components/tickets/TicketForm'

export default async function TicketsPage() {
  const supabase = await createSupabaseServer()

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })

    return (
    <>
      <TicketForm />
      <TicketList tickets={tickets || []} />
    </>
  )
}
