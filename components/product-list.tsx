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
import { GripVertical, X } from "lucide-react"
import { fullName } from "@/lib/data"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

function SortableCard({
  product,
  index,
  onRemove,
}: {
  product: Product
  index: number
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-mint-light bg-card px-3 py-4 shadow-sm sm:gap-4 sm:px-4",
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

      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose font-sans text-sm font-bold text-primary-foreground"
      >
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-base text-foreground">
          <span className="sr-only">Step {index + 1}: </span>
          {fullName(product)}
        </p>
        <p className="truncate font-body text-sm text-muted-foreground">{product.brand || "Added manually"}</p>
      </div>

      <span className="hidden shrink-0 rounded-full bg-mint-light px-3 py-1 font-body text-xs font-semibold text-mint-dark sm:inline">
        {product.category}
      </span>

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

/** The pre-analysis product list (numbered, draggable cards). */
export function ProductList({
  items,
  onRemove,
  onClear,
  onReorder,
}: {
  items: Product[]
  onRemove: (id: string) => void
  onClear: () => void
  onReorder: (items: Product[]) => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  // Reorder while dragging (not just on drop) so the numbers re-flow live.
  function move(e: DragOverEvent | DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const from = items.findIndex((p) => p.id === active.id)
    const to = items.findIndex((p) => p.id === over.id)
    if (from < 0 || to < 0) return
    onReorder(arrayMove(items, from, to))
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={move} onDragEnd={move}>
          <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <ol className="mt-6 space-y-3">
              {items.map((p, i) => (
                <SortableCard key={p.id} product={p} index={i} onRemove={onRemove} />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      )}
    </section>
  )
}
