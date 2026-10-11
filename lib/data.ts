import productsJson from "@/data/products.json"
import rulesJson from "@/data/rules.json"
import type { Active, ActiveId, Product, Rule } from "@/lib/types"

export const products = productsJson as Product[]
export const actives = rulesJson.actives as Active[]
export const rules = rulesJson.rules as Rule[]

const activeLabels = new Map(actives.map((a) => [a.id, a.label]))
export const activeLabel = (id: ActiveId) => activeLabels.get(id) ?? id

export const fullName = (p: Pick<Product, "brand" | "name">) => `${p.brand} ${p.name}`.trim()

/** Case-insensitive match across name, brand, and category. All query words must match. */
export function searchProducts(query: string, exclude: Set<string> = new Set(), limit = 8): Product[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  return products
    .filter((p) => {
      const hay = `${p.brand} ${p.name} ${p.category}`.toLowerCase()
      return words.every((w) => hay.includes(w))
    })
    .sort((a, b) => Number(exclude.has(a.id)) - Number(exclude.has(b.id)))
    .slice(0, limit)
}
