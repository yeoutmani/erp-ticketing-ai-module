export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 rounded bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-7 w-32 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-56 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Ticket form skeleton */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
          <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-12 rounded bg-gray-100 animate-pulse" />
            <div className="h-10 w-full rounded-md bg-gray-100 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-gray-100 animate-pulse" />
            <div className="h-[120px] w-full rounded-md bg-gray-100 animate-pulse" />
          </div>
          <div className="h-10 w-full rounded-xl bg-gray-200 animate-pulse" />
        </div>

        {/* Ticket list skeleton */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-gray-100 animate-pulse" />
            <div className="h-9 w-56 rounded-md bg-gray-100 animate-pulse" />
          </div>
          {/* Table header */}
          <div className="border-b bg-gray-50/50 py-3 px-4 flex gap-4">
            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
          </div>
          {/* Table rows */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="h-4 w-40 rounded bg-gray-100 animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-gray-100 animate-pulse" />
              <div className="h-4 w-20 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
