'use client'

import { useState } from "react"
import { supabaseClient } from "@/lib/supabaseClient"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

export default function TicketForm() {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) return

    if (!title.trim()) {
      setError("Title is required")
      addToast("Title is required", "error")
      return
    }

    setError(null)
    setLoading(true)

    const { data, error } = await supabaseClient
      .from("tickets")
      .insert({
        title: title.trim(),
        description: description.trim()
      })
      .select()
      .single()

    if (error || !data) {
      setError("Failed to create ticket")
      addToast("Failed to create ticket", "error")
      setLoading(false)
      return
    }

    await fetch(`${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}/ticket-created`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: data.id,
        title: data.title,
        description: data.description
      })
    })

    addToast("Ticket created successfully", "success")
    setTitle("")
    setDescription("")
    setLoading(false)
  }

  return (
    <Card>

      <CardHeader>
        <CardTitle>Create Ticket</CardTitle>
      </CardHeader>

      <CardContent>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>

            <input
              id="title"
              className="w-full border bg-background px-3 py-2 text-sm rounded-md
              focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Title of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>

            <textarea
              id="description"
              className="w-full border bg-background px-3 py-2 text-sm rounded-md min-h-[120px]
              focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Creating..." : "Create Ticket"}
          </Button>

        </form>

      </CardContent>

    </Card>
  )
}