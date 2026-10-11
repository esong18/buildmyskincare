"use client"

import { useId, useMemo, useState, type RefObject } from "react"
import { Plus, Search } from "lucide-react"
import { fullName, searchProducts } from "@/lib/data"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ProductSearch({
  selectedIds,
  onAdd,
  onManual,
  inputRef,
}: {
  selectedIds: Set<string>
  onAdd: (product: Product) => void
  onManual: (name: string) => void
  inputRef: RefObject<HTMLInputElement | null>
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const listId = useId()

  const results = useMemo(() => searchProducts(query, selectedIds), [query, selectedIds])
  const showPanel = open && query.trim().length > 0
  // One extra row at the end: the "add it by its actives" fallback.
  const optionCount = results.length + 1

  function choose(index: number) {
    if (index === results.length) {
      onManual(query.trim())
      setQuery("")
      setOpen(false)
      return
    }
    const product = results[index]
    if (!product || selectedIds.has(product.id)) return
    onAdd(product)
    setQuery("")
    setActive(0)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setOpen(true)
      setActive((i) => (i + 1) % optionCount)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((i) => (i - 1 + optionCount) % optionCount)
    } else if (e.key === "Enter" && showPanel) {
      e.preventDefault()
      choose(active)
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <div className="flex h-14 items-center gap-3 rounded-full border-2 border-mint bg-card px-5 shadow-[0_4px_16px_rgba(181,215,197,0.35)] transition-colors focus-within:border-mint-dark">
        <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-mint-mid" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showPanel ? `${listId}-${active}` : undefined}
          aria-label="Search products"
          placeholder="Search by product name, brand, or category…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="h-full w-full bg-transparent font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {showPanel && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Matching products"
          // Keep focus in the input so a click on an option doesn't blur-close the panel first.
          onMouseDown={(e) => e.preventDefault()}
          className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-auto rounded-2xl border border-border bg-card p-2 shadow-lg"
        >
          {results.length === 0 && (
            <li role="presentation" className="px-4 py-3 font-body text-sm text-muted-foreground">
              No match for &ldquo;{query.trim()}&rdquo;.
            </li>
          )}
          {results.map((p, i) => {
            const added = selectedIds.has(p.id)
            return (
              <li
                key={p.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                aria-disabled={added}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3",
                  i === active && "bg-mint-light",
                  added && "cursor-not-allowed opacity-60",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">{fullName(p)}</span>
                  <span className="block font-body text-xs text-muted-foreground">{p.category}</span>
                </span>
                {added && <span className="shrink-0 font-body text-xs font-semibold text-mint-dark">Added</span>}
              </li>
            )
          })}
          <li
            id={`${listId}-${results.length}`}
            role="option"
            aria-selected={active === results.length}
            onMouseEnter={() => setActive(results.length)}
            onClick={() => choose(results.length)}
            className={cn(
              "mt-1 flex cursor-pointer items-center gap-2 rounded-xl border-t border-border px-4 py-3 text-sm font-medium text-mint-dark",
              active === results.length && "bg-mint-light",
            )}
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Can&apos;t find it? Add it by its active ingredients
          </li>
        </ul>
      )}
    </div>
  )
}
