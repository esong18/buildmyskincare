# BuildMySkincare — ingredient compatibility checker (V1)

Add the products in your skincare routine and see whether their active ingredients
conflict, need care, or work well together. Single page, no backend, no accounts;
state lives in the browser session only.

Scope and flow: [docs/PRD.md](docs/PRD.md). Wireframes: [docs/wireframes](docs/wireframes).

## Run it

```bash
pnpm install --ignore-scripts
pnpm dev
```

## How it works

- `data/products.json`: products converted from `docs/source/Skincare Product List.xlsx`,
  plus a few wireframe examples. Each product lists its active ingredients.
- `data/rules.json`: the active-ingredient vocabulary and pairwise rules
  (`avoid` / `caution` / `synergy`, irritation vs. efficacy, plain-language explanation).
  Any pair without a rule is treated as no known interaction.
- `lib/analyze.ts`: checks every active across every product pair. List order does
  not affect the result in V1.
- `lib/order.ts`: suggested application order by product category (sunscreen last).
- `lib/pdf.ts`: builds the "Download Analysis (PDF)" file in the browser with jsPDF.
- `components/analyzer.tsx`: search, numbered draggable list (dnd-kit), results.

## Data caveat

Active ingredients and rules were drafted from general knowledge and are marked
`"verified": false`. Check them against each product's INCI list and a dermatological
source before relying on them. This is general guidance, not medical advice.
