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
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">ERP Ticketing</h2>

        <LogoutButton />
      </header>

      <main className="max-w-3xl mx-auto py-10 px-6 space-y-8">{children}</main>
    </div>
  )
}
