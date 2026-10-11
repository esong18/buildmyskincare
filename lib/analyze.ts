import { activeLabel, fullName, rules } from "@/lib/data"
import { suggestOrder, type OrderStep } from "@/lib/order"
import type { ActiveId, Concern, Product, Rule, RuleStatus } from "@/lib/types"

export interface Finding {
  key: string
  status: RuleStatus
  title: string
  explanation: string
  suggestion?: string
  concerns: Concern[]
  /** Active names to emphasise in the explanation. */
  terms: string[]
  /** The two products whose actives interact, as "Brand Name". */
  products: [string, string]
}

export type Verdict = "good" | "caution" | "attention"

export const VERDICT_TITLE: Record<Verdict, string> = {
  good: "Good to go",
  caution: "Some conflicts found",
  attention: "Needs attention",
}

export const VERDICT_BODY: Record<Verdict, string> = {
  good: "We didn\u2019t find any conflicts between the active ingredients in your routine.",
  caution: "Your routine works, but a few pairings need a little care.",
  attention: "Some products in your routine work against each other. See below for how to fix it.",
}

/** Names to highlight in an explanation, e.g. "Retinoid (retinol / retinal)" -> ["Retinoid"]. */
export function activeTerms(id: ActiveId): string[] {
  return activeLabel(id)
    .replace(/\s*\(.*\)/, "")
    .split("/")
    .map((t) => t.trim())
    .filter(Boolean)
}

export interface Analysis {
  verdict: Verdict
  findings: Finding[]
  counts: Record<RuleStatus, number>
  /** Products with no tracked active ingredients (cleansers, etc.). */
  skipped: string[]
  /** Suggested application order, by product category. */
  steps: OrderStep[]
  /** The routine as analyzed, in the user's order. */
  products: Product[]
}

const pairKey = (a: ActiveId, b: ActiveId) => [a, b].sort().join("|")
const ruleIndex = new Map<string, Rule>(rules.map((r) => [pairKey(r.pair[0], r.pair[1]), r]))

const statusRank: Record<RuleStatus, number> = { avoid: 0, caution: 1, synergy: 2 }

/**
 * Pairwise check of every active across every product pair. Order in the list does
 * not affect the result in V1 (PRD 6.1.1).
 */
export function analyze(items: Product[]): Analysis {
  const findings: Finding[] = []

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i]
      const b = items[j]
      const seen = new Set<string>()

      for (const x of a.actives) {
        for (const y of b.actives) {
          const key = pairKey(x, y)
          if (seen.has(key)) continue
          seen.add(key)
          const products: [string, string] = [fullName(a), fullName(b)]

          if (x === y) {
            findings.push({
              key: `${a.id}:${b.id}:${key}`,
              status: "caution",
              title: `Doubled up on ${activeLabel(x)}`,
              explanation: `Both products contain ${activeLabel(x)}. Using both adds little extra benefit and can raise the chance of irritation.`,
              suggestion: "Keep the one you prefer, or use them at different times of day.",
              concerns: [],
              terms: activeTerms(x),
              products,
            })
            continue
          }

          const rule = ruleIndex.get(key)
          if (!rule) continue
          findings.push({
            key: `${a.id}:${b.id}:${key}`,
            status: rule.status,
            title: `${activeLabel(rule.pair[0])} + ${activeLabel(rule.pair[1])}`,
            explanation: rule.explanation,
            suggestion: rule.suggestion,
            concerns: rule.concerns,
            terms: [...activeTerms(rule.pair[0]), ...activeTerms(rule.pair[1])],
            products,
          })
        }
      }
    }
  }

  findings.sort((p, q) => statusRank[p.status] - statusRank[q.status])

  const counts: Record<RuleStatus, number> = { avoid: 0, caution: 0, synergy: 0 }
  for (const f of findings) counts[f.status]++

  const verdict: Verdict = counts.avoid > 0 ? "attention" : counts.caution > 0 ? "caution" : "good"
  const skipped = items.filter((p) => p.actives.length === 0).map(fullName)

  return { verdict, findings, counts, skipped, steps: suggestOrder(items), products: items }
}
