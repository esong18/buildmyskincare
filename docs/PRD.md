# PRD: Skincare Ingredient Compatibility Checker (Microsite V1)

**Status:** Draft
**Owner:** [Your name]
**Last updated:** August 26, 2026

---

## 1. Overview

A lightweight, single-purpose microsite that lets users enter the products in their skincare routine and instantly see whether the **active ingredients** conflict with one another — helping them understand if their routine is actually working, or if certain products are cancelling each other out (or causing irritation).

V1 ships with exactly **one feature**: ingredient compatibility checking. No accounts, no routine builder/scheduler, no recommendations engine — just: input products → get a clear compatibility verdict.

---

## 2. Problem Statement

Most people build skincare routines by combining products recommended by different sources (dermatologists, influencers, ads) without knowing that certain active ingredients:
- Cancel each other's efficacy (e.g., some AHAs/BHAs deactivating certain antioxidants when layered incorrectly)
- Cause irritation when combined (e.g., retinol + vitamin C, or retinol + benzoyl peroxide)
- Are simply redundant and provide no added benefit when stacked

There's no simple, fast tool for a non-expert to check "will these products I already own work well together?"

---

## 3. Goals

### Primary goal (V1)
- Let a user input the products in their routine and receive a clear, understandable compatibility result.

### Success metrics
- % of sessions that complete a full check (enter products → see result)
- Average number of products entered per session (signal of real routine complexity)
- Return visit rate within 30 days
- Time to first result (should be fast — under ~60 seconds from landing to answer)
- Qualitative: user comprehension of *why* something conflicts (not just a red flag)

### Non-goals (explicitly out of scope for V1)
- User accounts / saved routines
- Product recommendations or "what to buy instead"
- Scheduling (AM/PM routine builder)
- Ingredient database contribution/editing by users
- Barcode scanning or photo-based product recognition
- E-commerce / affiliate links
- Mobile app (this is web-only, responsive)

---

## 4. Target User

Someone who already owns 3+ skincare products with actives (retinol, vitamin C, AHA/BHA, niacinamide, benzoyl peroxide, etc.) and wants a quick sanity check on whether their routine "makes sense" — not a dermatologist, not necessarily skincare-savvy, but engaged enough to have a multi-step routine.

---

## 5. Core User Flow (V1)

1. **Landing** — User arrives at the microsite, sees a short explainer of what the tool does and a CTA: "Start analyzing my routine."
2. **Search and select a product** — Tapping the CTA reveals a search bar. User types a product name; a selectable dropdown of matching products appears as they type.
   - If no match is found, user needs a fallback path (e.g., manually add active ingredients directly) rather than hitting a dead end — see Open Questions.
3. **Product added as a numbered card** — Selecting a product from the dropdown adds it to a running list, displayed as a card with a sequence number (order of application), appended to the bottom of the list by default.
   - User repeats steps 2–3 to add all products in their routine.
4. **Drag to reorder** — User can drag cards to rearrange them into their actual application order. Sequence numbers re-flow live as cards are dragged, not just after drop.
   - Note: in V1, the compatibility engine checks pairwise ingredient conflicts regardless of order — reordering is a UX/input nicety in V1 and doesn't change the analysis output. It sets up Phase 2 layering-order guidance (Section 11), where order will matter to the logic.
5. **Tap "analyze"** — Button is disabled until at least 2 products are in the list (nothing to compare against with only 1). Consider a subtle inline hint (e.g., "add one more product to analyze") rather than just a grayed-out button.
6. **Results** — User sees a clear compatibility result:
   - Overall status (e.g., "Good to go," "Some conflicts found," "Needs attention")
   - Specific pairwise conflicts called out by name (e.g., "Retinol + Vitamin C — may cause irritation if used together at the same time of day")
   - Plain-language explanation of *why*, not just a flag
7. **Edit and re-check** — User can remove a card, add another, or reorder, and re-run the analysis.

---

## 6. Functional Requirements

### 6.1 Product/Ingredient Input
- Entry point is a CTA ("Start analyzing my routine") that reveals a search bar
- User must be able to add multiple products to a single "routine" session via search-and-select
- Each product entry needs to resolve to a set of **active ingredients** (this is the core data dependency — see Section 8)
- Input method options to decide between (see Open Questions and Section 11.1):
  - Search-and-select from a pre-built product database, with a selectable autocomplete dropdown as the user types
  - Manual ingredient entry (user types/selects active ingredients directly, e.g., "retinol," "niacinamide") — needed as a fallback when a product search returns no match, and is the recommended default if product-database search isn't ready for V1
  - Hybrid: search by product name, fallback to manual ingredient tagging if product not found

### 6.1.1 Routine List (numbered, draggable cards)
- Each selected product renders as a card showing at minimum: sequence number, product name, remove control
- New products are appended to the bottom of the list by default, with the next sequential number
- Cards are drag-and-drop reorderable; sequence numbers re-flow live as a card is dragged, not only after drop
- Duplicate-add behavior needs a decision: block re-adding the same product, or allow multiple entries (see Open Questions)
- Removing a card re-flows the numbering of remaining cards
- **Analyze button state**: disabled/inactive until at least 2 products are in the list; show an inline hint rather than only a disabled button (e.g., "add one more product to analyze")
- **Note on order and V1 logic**: sequence/order is captured and displayed, but the V1 compatibility engine evaluates ingredient pairs regardless of position in the list — order does not currently affect the analysis result. This is intentional scaffolding for the Phase 2 AM/PM layering feature (Section 11), where order will become functionally relevant. Worth deciding whether V1 messaging should say anything about this, so users don't assume reordering changes their result.

### 6.2 Compatibility Engine
- System checks all pairwise combinations of active ingredients across entered products
- Each pair is evaluated against a compatibility ruleset with at least three states:
  - ✅ Compatible / no known interaction
  - ⚠️ Caution — works but with a caveat (e.g., "use at different times of day," "patch test first," "introduce slowly")
  - ❌ Avoid combining — known conflict (irritation risk or efficacy cancellation)
- Each flagged pair must include a short, plain-language explanation

### 6.3 Results Display
- Overall routine status at a glance
- Expandable/scrollable list of specific ingredient pair findings
- Clear differentiation between "irritation risk" vs. "efficacy/effectiveness" conflicts (the user's stated concern is specifically about effectiveness, so this distinction matters)
- Empty/no-conflict state should still feel like a positive, complete result — not just "nothing to show"

### 6.4 Editing
- User can remove a product and see the routine re-evaluate
- User can add additional products without starting over

---

## 7. Design & UX Notes

*(To be finalized against your Figma files and v0 output — flagging what the PRD should reflect once those are attached)*

- Single-page flow preferred over multi-step wizard, given this is a microsite with one job
- Mobile-first responsive layout
- Visual language should avoid alarming/medical red-flag styling for "caution" states — this is guidance, not a diagnosis
- Loading/checking state should feel fast and lightweight (this is a simple lookup, not a heavy computation — UI shouldn't imply otherwise)

**Action item:** Once Figma screenshots and v0 code are attached, this section should be updated with actual component names, screen states, and any design system tokens so engineering (via Cursor) has a 1:1 spec.

---

## 8. Data Requirements

This is the crux of the product and needs a decision before build starts:

- **Ingredient compatibility ruleset**: a structured dataset mapping ingredient pairs → compatibility status → explanation. Needs to be sourced/curated (dermatological sources, existing published skincare interaction guides) and will need a maintenance plan since new products/actives launch constantly.
- **Product-to-ingredient mapping**: if supporting product search (vs. manual ingredient entry), need a database of products mapped to their active ingredients. This is a significantly larger lift than the compatibility ruleset alone and affects V1 timeline.
- Recommend V1 ship with **manual active-ingredient selection** (user picks from a fixed list of common actives) rather than full product database matching, to keep scope tight and avoid a data-sourcing bottleneck. Product-name search can be a fast-follow (V2).

---

## 9. Technical Considerations

- Given the plan to build via Figma → v0 → Cursor, this is likely a React/Next.js-based static or lightly-backed site
- Compatibility ruleset can start as a static JSON/config file (no database needed for V1) given the ingredient list is finite and doesn't need real-time updates
- No auth/backend user data storage needed for V1 — routine state can live in client-side state (session-only, not persisted) unless persistence becomes a requirement
- Should be fast/lightweight — no reason for this to feel heavy given it's client-side rule matching against a static dataset

---

## 10. Open Questions

1. **Input method**: Manual ingredient selection vs. product name search vs. hybrid? (Recommend manual selection for V1 — see Section 8)
2. **Check trigger**: Auto-run as products are added, or require an explicit "Check" action?
3. **Ingredient data sourcing**: Who is curating/validating the compatibility ruleset, and what's the source of truth?
4. **Disclaimer/liability language**: Since this touches on skin health, do we need a "this is not medical advice" disclaimer in the UI?
5. **Persistence**: Does a user need their routine to persist across sessions in V1, or is session-only acceptable?
6. **Scope of "actives" covered**: Full list of ingredients to support at launch (e.g., retinoids, vitamin C/ascorbic acid, niacinamide, AHA/BHA, benzoyl peroxide, azelaic acid, hyaluronic acid, peptides, SPF filters)?
7. **Phase 2 data source decision**: When product-name search gets prioritized, confirm the sourcing approach — see Section 11.1 for a comparison of Open Beauty Facts vs. INCIDecoder vs. commercial options.
8. **V1 input method, revisited**: the search-and-select flow (Section 5, step 2) implies product-name search is needed for V1, not just manual ingredient selection as originally recommended in Section 8. Decide: build a seed database of common products for V1 launch, integrate Open Beauty Facts (Section 11.1) earlier than planned, or keep V1 to manual ingredient selection and treat the search/dropdown UI as the Phase 2 trigger.
9. **No-match fallback**: what happens when a user searches a product name with no dropdown match? Needs a manual ingredient-entry fallback so the flow doesn't dead-end.
10. **Duplicate products**: should selecting the same product twice add a second card, merge into one, or be blocked?
11. **Order messaging**: since V1's compatibility check doesn't use card order in its logic (Section 6.1.1), should the UI say anything to avoid implying that reordering changes the result?

---

## 11. Future Phases (Post-V1, not being built now)

- Product database search (name-based lookup instead of manual ingredient tagging) — see 11.1 for data sourcing options
- AM/PM routine scheduling and layering order guidance
- Saved routines / accounts
- Personalized recommendations for what to swap in/out
- Barcode or photo scanning for product entry — see 11.2

### 11.1 Product-to-ingredient data sourcing options (for product database search)

Researched three paths for resolving a product name to its ingredient list. None are being built in V1; capturing findings here so the decision is ready when this phase gets prioritized.

| Option | Summary | Pros | Cons |
|---|---|---|---|
| **Open Beauty Facts** | Nonprofit, crowdsourced, open database (same organization as Open Food Facts). Free, public, unauthenticated API. | No cost, no legal/licensing risk, genuinely open data, aligns with "not medical advice / transparency" tone of the product | Crowdsourced with no strict schema enforcement — data cleanliness and product coverage vary and will likely need normalization logic on our end |
| **INCIDecoder (via third-party scraping API)** | INCIDecoder does not offer an official public API. Third-party services exist that scrape INCIDecoder and expose it as a structured API (product search, ingredient lookup, INCI string decoding). | Cleaner, more complete data than Open Beauty Facts in practice | INCIDecoder's own Terms of Service prohibit data mining/scraping of their site — building on a third-party scraper puts us in a legal gray area we'd want to clear with legal or with INCIDecoder directly before relying on it |
| **Commercial ingredient API (e.g., "The Beauty API")** | Paid, commercial-grade database (~180k products) with cleaner INCI mapping and images. | Best data quality/coverage, production-ready, no scraping/legal ambiguity | Ongoing cost; adds a paid vendor dependency |

**Recommendation:** Start with Open Beauty Facts for Phase 2 (free, low legal risk, good enough to validate demand for product-name search). Revisit a commercial data provider if data quality/coverage becomes a blocker at scale. Avoid the INCIDecoder scraping route unless we get explicit permission from INCIDecoder.

### 11.2 AI-powered label parsing (photo → ingredients)

Concept: user photographs the ingredient list on a product's packaging → OCR extracts the raw text → parsing logic (LLM or regex against our ingredient dictionary) converts the comma-separated INCI list into structured ingredients for the compatibility engine.

- Feasible and a nice-to-have differentiator, but adds real build complexity: image capture flow, OCR accuracy (blurry photos, small print, curved bottles, non-English labels), and a correction UI for when parsing gets it wrong
- Recommend sequencing this after product database search (11.1) is live, since label parsing is most useful as a fallback for products not found in the database rather than as the primary input method
- Needs its own accuracy/QA pass before launch given the "effectiveness" claims users will be relying on the result for

---

## 12. Attachments / References

- Figma designs: *[link/attach here]*
- v0 generated code: *[link/attach here]*
- Ingredient compatibility source data: *[to be added]*
