'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabaseClient'

interface TicketData {
  title: string
  description: string
}

export default function TicketForm({
    createTicket = (data: TicketData) =>
      supabaseClient.from('tickets').insert(data)
  }) {
  const router = useRouter()
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

    const { error } = await createTicket({
      title,
      description
    })

    setLoading(false)

    if (error) {
      console.error('Error creating ticket:', error)
      setError('Failed to create ticket')
      return
    }

    setTitle('')
    setDescription('')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Ticket'}
      </button>

      {error && <p>{error}</p>}
    </form>
  )
}
