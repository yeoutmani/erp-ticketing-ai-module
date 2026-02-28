import TicketList from '@/components/tickets/TicketList'
import { createSupabaseServer } from '@/lib/supabaseServer'

export default async function TicketsPage() {
  const supabase = await createSupabaseServer()

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })

  return <TicketList tickets={tickets || []} />
}
