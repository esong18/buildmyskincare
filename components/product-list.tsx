"use client"

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"
import { GripVertical, Sun, X } from "lucide-react"
import { DropMark } from "@/components/drop-mark"
import { fullName } from "@/lib/data"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

/** "list" = the pre-analysis product list; "routine" = the My Routine card shown with results. */
type Variant = "list" | "routine"

function Thumb({ product }: { product: Product }) {
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
      {product.image ? (
        <Image src={product.image} alt="" width={56} height={56} className="h-full w-full object-contain" />
      ) : (
        <DropMark className="h-5 w-5 text-mint-mid" />
      )}
    </span>
  )
}

function SortableCard({
  product,
  index,
  variant,
  onRemove,
}: {
  product: Product
  index: number
  variant: Variant
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id })
  const routine = variant === "routine"

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 rounded-2xl border bg-card px-3 py-3 shadow-sm sm:gap-4 sm:px-4",
        routine ? "border-border" : "border-mint-light py-4",
        isDragging && "relative z-10 border-mint shadow-lg",
      )}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${fullName(product)}. Press space to pick up, arrow keys to move.`}
        className="shrink-0 cursor-grab touch-none rounded p-1 text-carbon-200 hover:text-carbon-400 focus-visible:outline-2 focus-visible:outline-mint-dark active:cursor-grabbing"
      >
        <GripVertical aria-hidden="true" className="h-5 w-5" />
      </button>

      {routine ? (
        <span aria-hidden="true" className="w-4 shrink-0 text-center font-sans text-lg text-carbon-200">
          {index + 1}
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose font-sans text-sm font-bold text-primary-foreground"
        >
          {index + 1}
        </span>
      )}

      {routine && <Thumb product={product} />}

      <div className="min-w-0 flex-1">
        <p className={cn("font-sans text-base", routine ? "text-navy sm:text-lg" : "truncate text-foreground")}>
          <span className="sr-only">Step {index + 1}: </span>
          {fullName(product)}
        </p>
        {routine ? (
          <span className="mt-1 inline-block rounded-full bg-carbon-50 px-2.5 py-0.5 font-body text-xs text-muted-foreground">
            {product.category}
          </span>
        ) : (
          <p className="truncate font-body text-sm text-muted-foreground">{product.brand || "Added manually"}</p>
        )}
      </div>

      {!routine && (
        <span className="hidden shrink-0 rounded-full bg-mint-light px-3 py-1 font-body text-xs font-semibold text-mint-dark sm:inline">
          {product.category}
        </span>
      )}

      <button
        type="button"
        onClick={() => onRemove(product.id)}
        aria-label={`Remove ${fullName(product)}`}
        className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X aria-hidden="true" className="h-5 w-5" />
      </button>
    </li>
  )
}

export function ProductList({
  items,
  variant = "list",
  onRemove,
  onClear,
  onReorder,
}: {
  items: Product[]
  variant?: Variant
  onRemove: (id: string) => void
  onClear: () => void
  onReorder: (items: Product[]) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const routine = variant === "routine"

  // Reorder while dragging (not just on drop) so the numbers re-flow live.
  function move(e: DragOverEvent | DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const from = items.findIndex((p) => p.id === active.id)
    const to = items.findIndex((p) => p.id === over.id)
    if (from < 0 || to < 0) return
    onReorder(arrayMove(items, from, to))
  }

  const clearButton = items.length > 0 && (
    <button type="button" onClick={onClear} className="text-sm text-muted-foreground underline hover:text-foreground">
      Clear all
    </button>
  )

  const body =
    items.length === 0 ? (
      <p className="py-10 text-center font-body text-sm text-muted-foreground">
        Search above and add the products in your routine, in the order you use them.
      </p>
    ) : (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={move} onDragEnd={move}>
        <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <ol className={cn("space-y-3", !routine && "mt-6")}>
            {items.map((p, i) => (
              <SortableCard key={p.id} product={p} index={i} variant={variant} onRemove={onRemove} />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
    )

  if (routine) {
    return (
      <section aria-labelledby="product-list-heading" className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between bg-mint-light px-5 py-4">
          <h3 id="product-list-heading" className="flex items-center gap-3 font-sans text-xl font-medium text-mint-dark">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card">
              <Sun aria-hidden="true" className="h-5 w-5" />
            </span>
            My Routine
            <span className="sr-only">, {items.length} products</span>
          </h3>
          {clearButton}
        </div>
        <div className="p-4 sm:p-5">{body}</div>
      </section>
    )
  }

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
        {clearButton}
      </div>
      {body}
    </section>
  )
}
