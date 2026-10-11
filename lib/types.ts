export type ActiveId = string

export interface Active {
  id: ActiveId
  label: string
}

export interface Product {
  id: string
  brand: string
  name: string
  category: string
  actives: ActiveId[]
  /** "sheet" = Skincare Product List.xlsx, "wireframe" = added from the Figma examples, "custom" = user-defined. */
  source: "sheet" | "wireframe" | "custom"
  /** Active ingredients are drafted, not yet checked against the product's INCI list. */
  verified: boolean
  note?: string
  /** Overrides brand + name where the design shows a different title. */
  displayName?: string
  /** Path under /public, shown as a thumbnail when present. */
  image?: string
}

export type RuleStatus = "avoid" | "caution" | "synergy"
export type Concern = "irritation" | "efficacy"

export interface Rule {
  pair: [ActiveId, ActiveId]
  status: RuleStatus
  concerns: Concern[]
  explanation: string
  suggestion?: string
}
