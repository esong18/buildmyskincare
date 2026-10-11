"use client"

import { forwardRef } from "react"
import { AlertTriangle, CheckCircle2, Sparkles, XCircle, type LucideIcon } from "lucide-react"
import type { Analysis, Finding, Verdict } from "@/lib/analyze"
import type { RuleStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const verdictCopy: Record<Verdict, { title: string; body: string; icon: LucideIcon; tone: string }> = {
  good: {
    title: "Good to go",
    body: "We didn’t find any conflicts between the active ingredients in your routine.",
    icon: CheckCircle2,
    tone: "border-mint bg-compatible-bg text-mint-dark",
  },
  caution: {
    title: "Some conflicts found",
    body: "Your routine works, but a few pairings need a little care.",
    icon: AlertTriangle,
    tone: "border-caution-text/30 bg-caution-bg text-caution-text",
  },
  attention: {
    title: "Needs attention",
    body: "Some products in your routine work against each other. See below for how to fix it.",
    icon: XCircle,
    tone: "border-rose/30 bg-avoid-bg text-rose",
  },
}

const statusStyle: Record<RuleStatus, { label: string; icon: LucideIcon; tone: string }> = {
  avoid: { label: "Avoid combining", icon: XCircle, tone: "border-l-rose bg-avoid-bg text-rose" },
  caution: { label: "Use with care", icon: AlertTriangle, tone: "border-l-caution-text bg-caution-bg text-caution-text" },
  synergy: { label: "Works well together", icon: Sparkles, tone: "border-l-mint-dark bg-compatible-bg text-mint-dark" },
}

const concernLabel = { irritation: "Irritation risk", efficacy: "Reduces effectiveness" } as const

function FindingCard({ finding }: { finding: Finding }) {
  const s = statusStyle[finding.status]
  const Icon = s.icon
  return (
    <li className={cn("rounded-xl border-l-4 p-5", s.tone)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
          <Icon aria-hidden="true" className="h-4 w-4" />
          {s.label}
        </span>
        {finding.concerns.map((c) => (
          <span key={c} className="rounded-full bg-card/70 px-2.5 py-0.5 font-body text-xs font-semibold">
            {concernLabel[c]}
          </span>
        ))}
      </div>
      <h4 className="mt-2 font-sans text-base font-semibold text-foreground">{finding.title}</h4>
      <p className="mt-1 font-body text-sm text-muted-foreground">
        {finding.products[0]} <span aria-hidden="true">&times;</span>
        <span className="sr-only"> and </span> {finding.products[1]}
      </p>
      <p className="mt-3 font-body text-sm leading-relaxed text-foreground">{finding.explanation}</p>
      {finding.suggestion && (
        <p className="mt-3 rounded-lg bg-card/70 px-3 py-2 font-body text-sm text-foreground">
          <span className="font-semibold">Suggestion: </span>
          {finding.suggestion}
        </p>
      )}
    </li>
  )
}

function Tile({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div className={cn("rounded-2xl border px-4 py-5 text-center", tone)}>
      <p className="font-sans text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide">{label}</p>
    </div>
  )
}

export const AnalysisResults = forwardRef<HTMLHeadingElement, { analysis: Analysis; stale: boolean }>(
  function AnalysisResults({ analysis, stale }, headingRef) {
    const v = verdictCopy[analysis.verdict]
    const VIcon = v.icon
    const issues = analysis.findings.filter((f) => f.status !== "synergy")
    const synergies = analysis.findings.filter((f) => f.status === "synergy")

    return (
      <section aria-labelledby="results-heading" className={cn("mt-14 transition-opacity", stale && "opacity-60")}>
        {stale && (
          <p role="status" className="mb-4 rounded-lg bg-caution-bg px-4 py-3 font-body text-sm text-caution-text">
            Your list has changed since this analysis. Analyze again to update the results.
          </p>
        )}

        <div className={cn("flex items-start gap-4 rounded-2xl border p-6", v.tone)}>
          <VIcon aria-hidden="true" className="mt-1 h-7 w-7 shrink-0" />
          <div>
            <h3 id="results-heading" ref={headingRef} tabIndex={-1} className="font-sans text-2xl font-bold focus:outline-none">
              {v.title}
            </h3>
            <p className="mt-1 font-body text-sm text-foreground">{v.body}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Tile value={analysis.counts.avoid} label="Conflicts" tone="border-rose/30 bg-avoid-bg text-rose" />
          <Tile value={analysis.counts.caution} label="Cautions" tone="border-caution-text/30 bg-caution-bg text-caution-text" />
          <Tile value={analysis.counts.synergy} label="Synergies" tone="border-mint bg-compatible-bg text-mint-dark" />
        </div>

        {issues.length > 0 && (
          <div className="mt-8">
            <h4 className="font-sans text-lg font-semibold text-navy">What to look at</h4>
            <ul className="mt-3 space-y-3">
              {issues.map((f) => (
                <FindingCard key={f.key} finding={f} />
              ))}
            </ul>
          </div>
        )}

        {synergies.length > 0 && (
          <div className="mt-8">
            <h4 className="font-sans text-lg font-semibold text-navy">What’s working</h4>
            <ul className="mt-3 space-y-3">
              {synergies.map((f) => (
                <FindingCard key={f.key} finding={f} />
              ))}
            </ul>
          </div>
        )}

        {analysis.findings.length === 0 && (
          <p className="mt-8 text-center font-body text-sm text-muted-foreground">
            No known interactions between these products. You can add more products and analyze again.
          </p>
        )}

        {analysis.skipped.length > 0 && (
          <p className="mt-6 font-body text-sm text-muted-foreground">
            No tracked actives, so not compared: {analysis.skipped.join(", ")}.
          </p>
        )}

        <p className="mt-8 border-t border-border pt-4 font-body text-xs text-muted-foreground">
          General ingredient guidance, not medical advice. If you have a skin condition or a reaction, check with a
          dermatologist.
        </p>
      </section>
    )
  },
)
