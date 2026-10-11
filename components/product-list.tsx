"use client"

import { X } from "lucide-react"
import { fullName } from "@/lib/data"
import type { Product } from "@/lib/types"

export function ProductList({
  items,
  onRemove,
  onClear,
}: {
  items: Product[]
  onRemove: (id: string) => void
  onClear: () => void
}) {
  return (
    <section aria-labelledby="product-list-heading" className="mt-10">
      <div className="flex items-center justify-between border-b border-mint-light pb-4">
        <div className="flex items-center gap-3">
          <h3 id="product-list-heading" className="font-sans text-xl font-semibold text-navy">
            Your Product List
          </h3>
          <span
            aria-label={`${items.length} products`}
            className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-rose px-2 text-sm font-semibold text-primary-foreground"
          >
            {items.length}
          </span>
        </div>
        {items.length > 0 && (
          <button type="button" onClick={onClear} className="text-sm text-muted-foreground underline hover:text-foreground">
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="py-10 text-center font-body text-sm text-muted-foreground">
          Search above and add the products in your routine, in the order you use them.
        </p>
      ) : (
        <ol className="mt-6 space-y-3">
          {items.map((p, i) => (
            <li
              key={p.id}
              className="flex items-center gap-4 rounded-2xl border border-mint-light bg-card px-5 py-4 shadow-sm"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose font-sans text-sm font-bold text-primary-foreground"
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-base text-foreground">
                  <span className="sr-only">Step {i + 1}: </span>
                  {fullName(p)}
                </p>
                <p className="truncate font-body text-sm text-muted-foreground">{p.brand || "Added manually"}</p>
              </div>
              <span className="hidden shrink-0 rounded-full bg-mint-light px-3 py-1 font-body text-xs font-semibold text-mint-dark sm:inline">
                {p.category}
              </span>
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                aria-label={`Remove ${fullName(p)}`}
                className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
