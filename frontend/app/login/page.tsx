'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.refresh()
    router.push('/tickets')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Welcome Back
        </h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}