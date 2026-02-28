import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabaseServer'
import LogoutButton from '@/components/buttons/logout'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <header>
        <h2>ERP Ticketing</h2>
        <LogoutButton />
      </header>
      <main>{children}</main>
    </div>
  )
}
