function FormSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-6 h-6 w-36 animate-pulse rounded bg-muted" />

      <div className="space-y-5">
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-32 w-full animate-pulse rounded-md bg-muted" />
        </div>

        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-6 h-6 w-24 animate-pulse rounded bg-muted" />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-9 w-56 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="overflow-hidden rounded-md border">
          <div className="grid grid-cols-4 gap-4 border-b bg-muted/40 px-4 py-3">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>

          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 border-b px-4 py-4 last:border-b-0"
            >
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-7 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <FormSkeleton />
        <TableSkeleton />
      </div>
    </div>
  )
}
