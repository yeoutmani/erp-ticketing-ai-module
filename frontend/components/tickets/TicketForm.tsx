'use client'

import { useState } from 'react'
import { supabaseClient } from '@/lib/supabaseClient'

interface TicketData {
  title: string
  description: string
}

export default function TicketForm({
  createTicket = (data: TicketData) =>
  supabaseClient
    .from('tickets')
    .insert(data)
    .select()
    .single()
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)
    setError(null)

    const { data, error } = await createTicket({
      title,
      description
    })

    if (error || !data) {
      setLoading(false)
      setError('Failed to create ticket')
      return
    }

    await fetch('http://localhost:5678/webhook/ticket-created', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: data.id
      })
    })

    setLoading(false)
    setTitle('')
    setDescription('')
  }

  return (
    <form
      className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 space-y-6"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-semibold text-gray-900">Create Ticket</h3>

      <div className="space-y-3">
        <input
          className="w-full rounded-xl border border-gray-300 bg-white 
          px-4 py-3 text-sm text-gray-900 
          placeholder:text-gray-400 
          shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 
          transition"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full rounded-xl border border-gray-300 bg-white 
          px-4 py-3 text-sm text-gray-900 
          placeholder:text-gray-400 
          min-h-[120px] resize-none 
          shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 
          transition"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Ticket'}
      </button>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}
    </form>
  )
}
