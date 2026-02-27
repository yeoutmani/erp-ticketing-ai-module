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

  return <button onClick={handleLogout}>Logout</button>
}