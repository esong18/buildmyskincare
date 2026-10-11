"use client"

import { forwardRef, useState, type ReactNode } from "react"
import { AlertTriangle, CheckCircle2, Download, Info, RotateCw, Sparkles, XCircle, type LucideIcon } from "lucide-react"
import { VERDICT_BODY, VERDICT_TITLE, type Analysis, type Finding, type Verdict } from "@/lib/analyze"
import { downloadAnalysisPdf } from "@/lib/pdf"
import type { RuleStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const verdictStyle: Record<Verdict, { icon: LucideIcon; tone: string }> = {
  good: { icon: CheckCircle2, tone: "border-mint bg-compatible-bg text-mint-dark" },
  caution: { icon: AlertTriangle, tone: "border-caution-text/30 bg-caution-bg text-caution-text" },
  attention: { icon: XCircle, tone: "border-rose/30 bg-avoid-bg text-rose" },
}

const statusStyle: Record<
  RuleStatus,
  { label: string; icon: LucideIcon; card: string; accent: string }
> = {
  avoid: { label: "Conflict detected", icon: AlertTriangle, card: "border-l-rose bg-avoid-bg", accent: "text-rose" },
  caution: { label: "Use with care", icon: AlertTriangle, card: "border-l-caution-text bg-caution-bg", accent: "text-caution-text" },
  synergy: { label: "Good synergy", icon: CheckCircle2, card: "border-l-synergy-border bg-synergy-bg", accent: "text-synergy" },
}

const concernLabel = { irritation: "Irritation risk", efficacy: "Reduces effectiveness" } as const

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** Bold the active names inside an explanation, e.g. "**Benzoyl Peroxide** oxidizes **Vitamin C**". */
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

function FindingCard({ finding }: { finding: Finding }) {
  const s = statusStyle[finding.status]
  const Icon = s.icon
  return (
    <li className={cn("rounded-xl border-l-4 px-5 py-4 shadow-sm", s.card)}>
      <p className={cn("flex items-center gap-2 text-sm font-semibold uppercase tracking-wide", s.accent)}>
        <Icon aria-hidden="true" className="h-4 w-4" />
        {s.label}
        {finding.concerns.map((c) => (
          <span
            key={c}
            className="rounded-full bg-card/70 px-2 py-0.5 font-body text-[11px] font-semibold normal-case tracking-normal"
          >
            {concernLabel[c]}
          </span>
        ))}
      </p>
      <p className="mt-3 font-body text-[15px] leading-relaxed text-foreground">
        {highlight(finding.explanation, finding.terms, s.accent)}
      </p>
      <p className="mt-2 font-body text-xs text-muted-foreground">
        {finding.products[0]} <span aria-hidden="true">&times;</span>
        <span className="sr-only"> and </span> {finding.products[1]}
      </p>
      {finding.suggestion && (
        <p className="mt-3 rounded-lg bg-card/80 px-3 py-2 font-body text-sm text-foreground">
          Suggestion: {finding.suggestion}
        </p>
      )}
    </li>
  )
}

function Tile({ value, label, className }: { value: number; label: string; className: string }) {
  return (
    <div className={cn("rounded-2xl border px-2 py-4 text-center", className)}>
      <p className="font-sans text-3xl font-bold leading-none">{value}</p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-foreground">{label}</p>
    </div>
  )
}

export const AnalysisResults = forwardRef<
  HTMLHeadingElement,
  { analysis: Analysis; stale: boolean; onReanalyze: () => void }
>(function AnalysisResults({ analysis, stale, onReanalyze }, headingRef) {
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(false)

  const v = verdictStyle[analysis.verdict]
  const VIcon = v.icon
  const issues = analysis.findings.filter((f) => f.status !== "synergy")
  const synergies = analysis.findings.filter((f) => f.status === "synergy")

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
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:sticky lg:top-24"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-carbon-50 px-5 py-5 sm:px-6">
        <h3 className="flex items-center gap-2 font-sans text-xl font-semibold text-navy">
          <Sparkles aria-hidden="true" className="h-5 w-5 text-pink" />
          Compatibility Analysis
        </h3>
        <button
          type="button"
          onClick={onReanalyze}
          className={cn(
            "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors",
            stale
              ? "border-rose bg-rose text-primary-foreground hover:bg-rose/90"
              : "border-border bg-card text-foreground hover:bg-muted",
          )}
        >
          <RotateCw aria-hidden="true" className="h-3.5 w-3.5" />
          Re-analyze
        </button>
      </div>

      <div className="p-5 sm:p-6">
        {stale && (
          <p role="status" className="mb-5 rounded-lg bg-caution-bg px-4 py-3 font-body text-sm text-caution-text">
            Your list has changed since this analysis. Re-analyze to update the results.
          </p>
        )}

        <div className={cn("transition-opacity", stale && "opacity-60")}>
          <div className={cn("flex items-start gap-3 rounded-2xl border px-4 py-3", v.tone)}>
            <VIcon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <h4 ref={headingRef} tabIndex={-1} className="font-sans text-base font-bold focus:outline-none">
                {VERDICT_TITLE[analysis.verdict]}
              </h4>
              <p className="font-body text-sm text-foreground">{VERDICT_BODY[analysis.verdict]}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Tile value={analysis.counts.avoid} label="Conflicts" className="border-rose/30 bg-avoid-bg text-rose" />
            <Tile value={analysis.counts.caution} label="Cautions" className="border-caution-text/30 bg-caution-bg text-caution-text" />
            <Tile value={analysis.counts.synergy} label="Synergies" className="border-border bg-card text-mint-dark" />
            <Tile value={analysis.steps.length} label="Steps" className="border-border bg-card text-synergy" />
          </div>

          {issues.length > 0 && (
            <ul className="mt-6 space-y-4" aria-label="Conflicts and cautions">
              {issues.map((f) => (
                <FindingCard key={f.key} finding={f} />
              ))}
            </ul>
          )}

          {synergies.length > 0 && (
            <ul className="mt-4 space-y-4" aria-label="Synergies">
              {synergies.map((f) => (
                <FindingCard key={f.key} finding={f} />
              ))}
            </ul>
          )}

          {analysis.findings.length === 0 && (
            <p className="mt-6 text-center font-body text-sm text-muted-foreground">
              No known interactions between these products. Add more products and re-analyze any time.
            </p>
          )}

          <div className="mt-8 border-t border-border pt-6">
            <h4 className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-wide text-foreground">
              <Info aria-hidden="true" className="h-4 w-4 text-pink" />
              Suggested application order
            </h4>
            <ol className="mt-4 space-y-4">
              {analysis.steps.map((step, i) => (
                <li key={`${step.name}-${i}`} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-pink" />
                  <span className="w-12 shrink-0 font-body text-sm font-semibold text-muted-foreground">Step {i + 1}</span>
                  <div className="min-w-0">
                    <p className="font-sans text-base text-foreground">{step.name}</p>
                    {step.note && (
                      <p
                        className={cn(
                          "mt-0.5 font-body text-sm",
                          step.note.tone === "ok" ? "text-mint-dark" : "text-caution-text",
                        )}
                      >
                        {step.note.tone === "ok" ? "✓ " : ""}
                        {step.note.text}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {analysis.skipped.length > 0 && (
            <p className="mt-6 font-body text-sm text-muted-foreground">
              No tracked actives, so not compared: {analysis.skipped.join(", ")}.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={download}
          disabled={downloading}
          className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-rose font-sans text-base font-semibold text-primary-foreground transition-colors hover:bg-rose/90 disabled:cursor-wait disabled:opacity-70"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          {downloading ? "Preparing PDF…" : "Download Analysis (PDF)"}
        </button>
        {downloadError && (
          <p role="alert" className="mt-2 text-center font-body text-sm text-rose">
            Couldn&apos;t create the PDF. Please try again.
          </p>
        )}

        <p className="mt-6 font-body text-xs leading-relaxed text-muted-foreground">
          General ingredient guidance, not medical advice. If you have a skin condition or a reaction, check with a
          dermatologist.
        </p>
      </div>
    </section>
  )
})
