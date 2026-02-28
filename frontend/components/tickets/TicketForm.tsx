'use client'

import { useState } from 'react'

export default function TicketForm() {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    try {
      throw new Error('Request failed')
    } catch (err) {
      setError('Error occurred: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <button type="submit">Submit</button>
      {error && <p>{error}</p>}
    </form>
  )
}
