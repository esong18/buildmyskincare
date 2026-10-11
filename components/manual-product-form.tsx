"use client"

import { useState } from "react"
import { actives } from "@/lib/data"
import type { ActiveId, Product } from "@/lib/types"

export function ManualProductForm({
  initialName,
  onAdd,
  onCancel,
}: {
  initialName: string
  onAdd: (product: Product) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initialName)
  const [selected, setSelected] = useState<Set<ActiveId>>(new Set())
  const canAdd = name.trim().length > 0 && selected.size > 0

  function toggle(id: ActiveId) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!canAdd) return
    onAdd({
      id: `custom-${crypto.randomUUID()}`,
      brand: "",
      name: name.trim(),
      category: "Custom",
      actives: [...selected],
      source: "custom",
      verified: true,
    })
  }

  return (
    <form onSubmit={submit} className="mt-4 rounded-2xl border border-mint bg-mint-light/50 p-5">
      <h3 className="font-sans text-base font-semibold text-foreground">Add a product by its actives</h3>
      <p className="mt-1 font-body text-sm text-muted-foreground">
        Name it, then tick the active ingredients listed on the label.
      </p>

      <label className="mt-4 block font-body text-sm font-medium text-foreground" htmlFor="manual-name">
        Product name
      </label>
      <input
        id="manual-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1 h-11 w-full rounded-lg border border-border bg-card px-3 font-body text-base focus:border-mint-dark focus:outline-none"
      />

      <fieldset className="mt-4">
        <legend className="font-body text-sm font-medium text-foreground">Active ingredients</legend>
        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {actives.map((a) => (
            <label key={a.id} className="flex cursor-pointer items-center gap-3 font-body text-sm text-foreground">
              <input
                type="checkbox"
                checked={selected.has(a.id)}
                onChange={() => toggle(a.id)}
                className="h-4 w-4 accent-mint-dark"
              />
              {a.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={!canAdd}
          className="inline-flex h-11 items-center rounded-lg bg-rose px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-rose/90 disabled:cursor-not-allowed disabled:bg-carbon-100 disabled:text-carbon-300"
        >
          Add to my list
        </button>
        <button type="button" onClick={onCancel} className="text-sm font-medium text-muted-foreground underline">
          Cancel
        </button>
      </div>
    </form>
  )
}
