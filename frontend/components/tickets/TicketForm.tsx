'use client'

import { useState } from "react"
import { supabaseClient } from "@/lib/supabaseClient"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const TITLE_MIN_LENGTH = 3
const TITLE_MAX_LENGTH = 100
const DESCRIPTION_MAX_LENGTH = 500

export default function TicketForm() {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [titleError, setTitleError] = useState<string | null>(null)
  const [descriptionError, setDescriptionError] = useState<string | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState<{ title: boolean; description: boolean }>({
    title: false,
    description: false,
  })

  const validateTitle = (value: string): string | null => {
    if (!value.trim()) return "Title is required"
    if (value.trim().length < TITLE_MIN_LENGTH) return `Title must be at least ${TITLE_MIN_LENGTH} characters`
    if (value.trim().length > TITLE_MAX_LENGTH) return `Title must be less than ${TITLE_MAX_LENGTH} characters`
    return null
  }

  const validateDescription = (value: string): string | null => {
    if (value.length > DESCRIPTION_MAX_LENGTH) return `Description must be less than ${DESCRIPTION_MAX_LENGTH} characters`
    return null
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (touched.title) {
      setTitleError(validateTitle(value))
    }
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    if (touched.description) {
      setDescriptionError(validateDescription(value))
    }
  }

  const handleTitleBlur = () => {
    setTouched((prev) => ({ ...prev, title: true }))
    setTitleError(validateTitle(title))
  }

  const handleDescriptionBlur = () => {
    setTouched((prev) => ({ ...prev, description: true }))
    setDescriptionError(validateDescription(description))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields on submit
    const tErr = validateTitle(title)
    const dErr = validateDescription(description)
    setTitleError(tErr)
    setDescriptionError(dErr)
    setTouched({ title: true, description: true })

    if (tErr || dErr) return
    if (loading) return

    setGeneralError(null)
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
      setGeneralError("Failed to create ticket. Please try again.")
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

    setTitle("")
    setDescription("")
    setTitleError(null)
    setDescriptionError(null)
    setTouched({ title: false, description: false })
    setLoading(false)
  }

  const isFormValid = !validateTitle(title) && !validateDescription(description)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Ticket</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <span className="text-xs text-muted-foreground">
                {title.length}/{TITLE_MAX_LENGTH}
              </span>
            </div>

            <input
              id="title"
              className={`w-full border bg-background px-3 py-2 text-sm rounded-md
                focus:outline-none focus:ring-2 focus:ring-primary
                ${titleError && touched.title ? "border-red-500 focus:ring-red-500" : ""}`}
              placeholder="Title of the issue"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={handleTitleBlur}
              maxLength={TITLE_MAX_LENGTH}
              required
              aria-invalid={touched.title && !!titleError}
              aria-describedby={titleError && touched.title ? "title-error" : undefined}
            />
            {titleError && touched.title && (
              <p id="title-error" className="text-sm text-red-500 flex items-center gap-1" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {titleError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <span className="text-xs text-muted-foreground">
                {description.length}/{DESCRIPTION_MAX_LENGTH}
              </span>
            </div>

            <textarea
              id="description"
              className={`w-full border bg-background px-3 py-2 text-sm rounded-md min-h-[120px]
                focus:outline-none focus:ring-2 focus:ring-primary
                ${descriptionError && touched.description ? "border-red-500 focus:ring-red-500" : ""}`}
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              onBlur={handleDescriptionBlur}
              maxLength={DESCRIPTION_MAX_LENGTH}
              aria-invalid={touched.description && !!descriptionError}
              aria-describedby={descriptionError && touched.description ? "description-error" : undefined}
            />
            {descriptionError && touched.description && (
              <p id="description-error" className="text-sm text-red-500 flex items-center gap-1" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {descriptionError}
              </p>
            )}
          </div>

          {generalError && (
            <p className="text-sm text-red-500 flex items-center gap-1" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {generalError}
            </p>
          )}

          <Button type="submit" disabled={loading || !isFormValid} fullWidth>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </span>
            ) : "Create Ticket"}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}
