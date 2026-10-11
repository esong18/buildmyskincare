"use client"

import { forwardRef } from "react"
import { AnalysisResults } from "@/components/analysis-results"
import { DesignIcon } from "@/components/design-icons"
import { RoutineCard } from "@/components/routine-card"
import type { Analysis } from "@/lib/analyze"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

/**
 * The skin profile has no source in V1 (no quiz yet), so these are the example chips
 * from the design rather than the user's answers.
 */
const SKIN_PROFILE = [
  { label: "Dry Skin", className: "bg-[#fff0f3] text-[#f26a8d]" },
  { label: "Acne-Prone", className: "bg-[#e0f2fe] text-[#0284c7]" },
  { label: "Hyperpigmentation", className: "bg-[#fefce8] text-[#ca8a04]" },
]

/** Results screen, built from the Figma frame "Skincare Compatibility Analysis Page- v1". */
export const ResultsScreen = forwardRef<
  HTMLHeadingElement,
  {
    items: Product[]
    analysis: Analysis
    stale: boolean
    onReorder: (items: Product[]) => void
    onRemove: (id: string) => void
    onEdit: () => void
    onReanalyze: () => void
  }
>(function ResultsScreen({ items, analysis, stale, onReorder, onRemove, onEdit, onReanalyze }, headingRef) {
  return (
    <div className="mx-auto w-full max-w-[1302px] px-5 sm:px-8 lg:px-12">
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-2 text-sm font-medium leading-5 text-[#6a7282]"
      >
        <DesignIcon name="back" className="size-[18px]" />
        Back to Profile
      </button>

      <div className="mt-6 border-b border-[#f3f4f6] pb-[25px] sm:mt-[49px]">
        <h2 id="analyze-heading" className="text-[32px] font-medium leading-tight tracking-[-1.2px] text-[#f26a8d] sm:text-[48px] sm:leading-[48px]">
          My Skincare Routines
        </h2>
        <p className="mt-2 flex items-center gap-2 text-base leading-6 text-[#6a7282]">
          <span aria-hidden="true" className={cn("size-2 rounded-full", stale ? "bg-[#e17100]" : "bg-[#05df72]")} />
          {stale ? "Changes not analyzed yet" : "Last updated just now"}
        </p>
      </div>

      <div className="mt-[23px] grid grid-cols-1 items-start gap-8 pb-24 lg:grid-cols-[minmax(0,690fr)_minmax(0,484fr)]">
        <div className="flex flex-col gap-8">
          <section
            aria-label="Skin profile"
            className="flex h-[82px] items-center rounded-2xl border border-[#e5e7eb] bg-white px-[17px] shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)]"
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase leading-4 tracking-[0.6px] text-[#99a1af]">Skin Profile</h3>
              <ul className="flex flex-wrap gap-2">
                {SKIN_PROFILE.map((chip) => (
                  <li key={chip.label} className={cn("h-6 rounded-full px-3 text-xs font-bold leading-6", chip.className)}>
                    {chip.label}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <RoutineCard items={items} onReorder={onReorder} onRemove={onRemove} onEdit={onEdit} />
        </div>

        <AnalysisResults ref={headingRef} analysis={analysis} stale={stale} onReanalyze={onReanalyze} />
      </div>
    </div>
  )
})
