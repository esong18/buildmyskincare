"use client"

import { forwardRef, useState, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { DesignIcon } from "@/components/design-icons"
import { VERDICT_BODY, VERDICT_TITLE, type Analysis, type Finding } from "@/lib/analyze"
import { downloadAnalysisPdf } from "@/lib/pdf"
import type { RuleStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** Emphasise the active names inside an explanation, as the design does. */
function highlight(text: string, terms: string[], className: string): ReactNode {
  if (terms.length === 0) return text
  const re = new RegExp(`\\b(${terms.map(escapeRe).join("|")})(?:s)?\\b`, "gi")
  const parts: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(re)) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(
      <strong key={m.index} className={cn("font-semibold", className)}>
        {m[0]}
      </strong>,
    )
    last = m.index + m[0].length
  }
  parts.push(text.slice(last))
  return parts
}

const card: Record<RuleStatus, { label: string; box: string; labelColor: string; name: string }> = {
  avoid: { label: "CONFLICT DETECTED", box: "border-l-[#dd2d4a] bg-[#fef2f2] pt-4", labelColor: "text-[#dd2d4a]", name: "text-[#dd2d4a]" },
  caution: { label: "USE WITH CARE", box: "border-l-[#8a5a0b] bg-[#fcefd6] pt-4", labelColor: "text-[#8a5a0b]", name: "text-[#8a5a0b]" },
  synergy: { label: "GOOD SYNERGY", box: "border-l-[#83b0e1] bg-[#f0f9ff] pt-3", labelColor: "text-[#093c74]", name: "text-[#093c74]" },
}

const CARD_SHADOW = "shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)]"

function FindingCard({ finding }: { finding: Finding }) {
  const s = card[finding.status]
  return (
    <li className={cn("flex flex-col gap-2 rounded-r-[14px] border-l-4 pb-4 pl-5 pr-4", CARD_SHADOW, s.box)}>
      <p className={cn("flex h-5 items-center gap-2 text-xs font-medium", s.labelColor)}>
        {finding.status === "avoid" && <DesignIcon name="conflict" className="size-4" />}
        {finding.status === "synergy" && <DesignIcon name="synergy" className="size-4" />}
        {finding.status === "caution" && <AlertTriangle aria-hidden="true" className="size-4" />}
        {s.label}
      </p>
      <p className="text-xs leading-[22.75px] text-[#364153]">{highlight(finding.explanation, finding.terms, s.name)}</p>
      {finding.suggestion && (
        <p className="rounded bg-white/60 px-2 py-2 text-xs leading-4 text-[#364153]">Suggestion: {finding.suggestion}</p>
      )}
    </li>
  )
}

function Tile({ value, label, kind }: { value: number; label: string; kind: "conflict" | "synergy" | "steps" }) {
  const styles = {
    conflict: "border-[rgba(255,201,201,0.5)] bg-[#fff5f5] text-[#e03131] drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.1)]",
    synergy: "border-[rgba(54,65,83,0.02)] bg-white text-[#2f9e44] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)]",
    steps: "border-[rgba(54,65,83,0.02)] bg-white text-[#1971c2] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)]",
  }
  return (
    <div className={cn("flex h-[90.5px] flex-col items-center justify-center gap-1 rounded-2xl border p-px", styles[kind])}>
      <span className="text-[30px] font-bold leading-9">{value}</span>
      <span className="text-[11px] font-semibold uppercase leading-[16.5px] tracking-[1.1px] text-[#364153]">{label}</span>
    </div>
  )
}

export const AnalysisResults = forwardRef<
  HTMLHeadingElement,
  { analysis: Analysis; stale: boolean; onReanalyze: () => void }
>(function AnalysisResults({ analysis, stale, onReanalyze }, headingRef) {
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(false)

  const cards = analysis.findings
  const conflicts = analysis.counts.avoid + analysis.counts.caution

  async function download() {
    setDownloading(true)
    setDownloadError(false)
    try {
      await downloadAnalysisPdf(analysis)
    } catch {
      setDownloadError(true)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section
      aria-label="Compatibility analysis"
      className="flex flex-col overflow-clip rounded-3xl border border-[#e5e7eb] bg-white p-px shadow-[0_20px_25px_-5px_rgba(243,244,246,0.5),0_8px_10px_-6px_rgba(243,244,246,0.5)] lg:sticky lg:top-[97px]"
    >
      <div className="flex h-[90px] shrink-0 items-start justify-between border-b border-[#f3f4f6] bg-[rgba(249,250,251,0.5)] px-6 pt-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold leading-[27px] tracking-[-0.45px] text-[#093c74]">
          <DesignIcon name="sparkles" className="size-[18px]" />
          Compatibility Analysis
        </h3>
        <button
          type="button"
          onClick={onReanalyze}
          className={cn(
            "h-[30px] rounded-[10px] border bg-white px-3.5 text-xs font-medium",
            stale ? "border-[#dd2d4a] text-[#dd2d4a]" : "border-[#e5e7eb] text-[#093c74]",
          )}
        >
          Re-analyze
        </button>
      </div>

      <div className="px-6 pb-6 pt-6">
        {/* Overall status, announced to screen readers; the design shows it through the tiles and cards. */}
        <h4 ref={headingRef} tabIndex={-1} className="sr-only focus:outline-none">
          {VERDICT_TITLE[analysis.verdict]}. {VERDICT_BODY[analysis.verdict]}
          {stale ? " Your list has changed since this analysis." : ""}
        </h4>

        <div className={cn("flex flex-col gap-6 transition-opacity", stale && "opacity-60")}>
          <div className="grid grid-cols-3 gap-3">
            <Tile value={conflicts} label="Conflicts" kind="conflict" />
            <Tile value={analysis.counts.synergy} label="Synergies" kind="synergy" />
            <Tile value={analysis.steps.length} label="Steps" kind="steps" />
          </div>

          {cards.length > 0 ? (
            <ul className="flex flex-col gap-6">
              {cards.map((f) => (
                <FindingCard key={f.key} finding={f} />
              ))}
            </ul>
          ) : (
            <ul>
              <li className={cn("flex flex-col gap-2 rounded-r-[14px] border-l-4 border-l-[#83b0e1] bg-[#f0f9ff] pb-4 pl-5 pr-4 pt-3", CARD_SHADOW)}>
                <p className="flex h-5 items-center gap-2 text-xs font-medium text-[#093c74]">
                  <DesignIcon name="synergy" className="size-4" />
                  NO CONFLICTS
                </p>
                <p className="text-xs leading-[22.75px] text-[#364153]">
                  We didn&apos;t find any conflicts between the active ingredients in your routine.
                </p>
              </li>
            </ul>
          )}

          <div className="flex flex-col gap-4 border-t border-[#f3f4f6] pt-[25px]">
            <h4 className="flex h-5 items-center gap-2 text-sm font-medium leading-5 text-[#1e2939]">
              <DesignIcon name="info" className="size-4" />
              SUGGESTED APPLICATION ORDER
            </h4>
            <ol className="flex flex-col gap-6 pl-4">
              {analysis.steps.map((step, i) => (
                <li key={`${step.name}-${i}`} className="relative flex gap-3">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[21.59px] top-0 size-3 rounded-full border-2 border-white bg-[#f26a8d] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)]"
                  />
                  <span className="w-12 shrink-0 text-xs font-semibold leading-4 text-[#99a1af]">Step {i + 1}</span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="text-sm leading-5 text-[#1e2939]">{step.name}</p>
                    {step.note && (
                      <p className={cn("text-xs leading-4", step.note.tone === "ok" ? "text-[#00a63e]" : "text-[#e17100]")}>
                        {step.note.tone === "ok" ? "✓ " : "↺ "}
                        {step.note.text}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <button
          type="button"
          onClick={download}
          disabled={downloading}
          className="mt-6 flex h-10 w-full items-center justify-center rounded-full bg-[#dd2d4a] px-5 text-sm font-medium leading-5 text-white shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#c42b47] disabled:cursor-wait disabled:opacity-70"
        >
          {downloading ? "Preparing PDF…" : "Download Analysis (PDF)"}
        </button>
        {downloadError && (
          <p role="alert" className="mt-2 text-center text-xs text-[#dd2d4a]">
            Couldn&apos;t create the PDF. Please try again.
          </p>
        )}
      </div>
    </section>
  )
})
