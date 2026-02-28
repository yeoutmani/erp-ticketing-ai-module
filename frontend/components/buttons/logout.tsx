'use client'

import { supabaseClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabaseClient.auth.signOut()

    router.refresh()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Logout
    </button>
  )
}
