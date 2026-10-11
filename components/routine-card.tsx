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
import { X } from "lucide-react"
import { DesignIcon, SunIcon } from "@/components/design-icons"
import { DropMark } from "@/components/drop-mark"
import { fullName } from "@/lib/data"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

const title = (p: Product) => p.displayName ?? fullName(p)
// The design calls sunscreens "Protection".
const categoryLabel = (c: string) => (c === "Sunscreen" ? "Protection" : c)

function Row({
  product,
  index,
  total,
  onRemove,
}: {
  product: Product
  index: number
  total: number
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "relative flex h-[74px] items-center gap-4 rounded-[14px] border border-[#f3f4f6] bg-white pl-[13px] pr-12",
        isDragging && "z-10 border-[#b5d7c5] shadow-lg",
      )}
    >
      {/* The row number is the drag handle, so the row looks exactly like the design. */}
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={`${title(product)}, position ${index + 1} of ${total}. Press space to pick up, arrow keys to move.`}
        className="h-7 w-6 shrink-0 cursor-grab touch-none text-center text-lg font-medium leading-7 text-[#d1d5dc] focus-visible:outline-2 focus-visible:outline-[#2f6b4c] active:cursor-grabbing"
      >
        {index + 1}
      </button>

      <span className="flex size-12 shrink-0 items-center justify-center overflow-clip rounded-[10px] bg-[#f3f4f6]">
        {product.image ? (
          <Image src={product.image} alt="" width={48} height={48} className="size-12 object-cover" />
        ) : (
          <DropMark className="size-5 text-[#82bb9d]" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium leading-6 text-[#093c74]">{title(product)}</p>
        <span className="mt-[3px] inline-flex h-[20.5px] items-center rounded-full bg-[#f9fafb] px-2 text-xs leading-4 text-[#99a1af]">
          {categoryLabel(product.category)}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onRemove(product.id)}
        aria-label={`Remove ${title(product)}`}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#99a1af] transition-colors hover:bg-[#f3f4f6] hover:text-[#364153]"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </li>
  )
}

export function RoutineCard({
  items,
  onReorder,
  onRemove,
  onEdit,
}: {
  items: Product[]
  onReorder: (items: Product[]) => void
  onRemove: (id: string) => void
  onEdit: () => void
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  // Reorder while dragging so the numbers re-flow live.
  function move(e: DragOverEvent | DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const from = items.findIndex((p) => p.id === active.id)
    const to = items.findIndex((p) => p.id === over.id)
    if (from < 0 || to < 0) return
    onReorder(arrayMove(items, from, to))
  }

  return (
    <section
      aria-labelledby="my-routine-heading"
      className="flex flex-col overflow-clip rounded-3xl border border-[rgba(47,107,76,0.5)] bg-white p-0.5 shadow-[0_4px_6px_-4px_#fdf2f8]"
    >
      <div className="flex h-[69px] shrink-0 items-center justify-between border-b border-[#e5f4ec] bg-[#e5f4ec] px-6 pb-px">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 flex-col items-start rounded-full bg-white px-2 pt-2 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)]">
            <SunIcon />
          </span>
          <h3 id="my-routine-heading" className="text-xl font-medium leading-7 text-[#2f6b4c]">
            My Routine
          </h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit routine: add or change products"
          className="flex size-[34px] items-center justify-center rounded-full transition-colors hover:bg-white/60"
        >
          <DesignIcon name="edit" className="size-[16.5px]" />
        </button>
      </div>

      <div className="bg-white px-6 pb-[46px] pt-6">
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#6a7282]">Your routine is empty. Use the pencil to add products.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={move} onDragEnd={move}>
            <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <ol className="flex flex-col gap-3">
                {items.map((p, i) => (
                  <Row key={p.id} product={p} index={i} total={items.length} onRemove={onRemove} />
                ))}
              </ol>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </section>
  )
}
