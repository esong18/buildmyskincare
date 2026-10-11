import { fullName } from "@/lib/data"
import type { Product } from "@/lib/types"

export interface OrderStep {
  name: string
  note?: { tone: "revised" | "ok"; text: string }
}

/** Typical order of application: thinnest/most water-based first, sunscreen last. */
const CATEGORY_RANK: Record<string, number> = {
  Cleanser: 0,
  Toner: 1,
  Serum: 2,
  Treatment: 3,
  Moisturizer: 4,
  Sunscreen: 5,
}
const UNKNOWN_RANK = 2.5 // custom products: between serums and treatments

const rank = (p: Product) => CATEGORY_RANK[p.category] ?? UNKNOWN_RANK

/**
 * Suggested application order by product category. Products already in a valid
 * relative order (the longest non-decreasing run of the user's list) are left
 * alone; the rest are flagged as repositioned.
 */
export function suggestOrder(items: Product[]): OrderStep[] {
  const n = items.length
  const ranks = items.map(rank)

  // Longest non-decreasing subsequence, O(n^2): n is a routine, so tiny.
  const len = new Array<number>(n).fill(1)
  const prev = new Array<number>(n).fill(-1)
  let best = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (ranks[j] <= ranks[i] && len[j] + 1 > len[i]) {
        len[i] = len[j] + 1
        prev[i] = j
      }
    }
    if (len[i] > len[best]) best = i
  }
  const inPlace = new Set<number>()
  for (let k = n > 0 ? best : -1; k >= 0; k = prev[k]) inPlace.add(k)

  const order = items
    .map((p, i) => ({ p, i }))
    .sort((a, b) => rank(a.p) - rank(b.p) || a.i - b.i)

  return order.map(({ p, i }, pos) => {
    const sunscreen = p.category === "Sunscreen"
    const step: OrderStep = { name: p.displayName ?? fullName(p) }
    if (!inPlace.has(i)) {
      step.note = {
        tone: "revised",
        text: sunscreen
          ? "Moved to the last step so nothing dilutes your sun protection"
          : "Revised position for better absorption",
      }
    } else if (sunscreen && pos === n - 1) {
      step.note = { tone: "ok", text: "Correct placement (Last step)" }
    }
    return step
  })
}
