import { VERDICT_BODY, VERDICT_TITLE, type Analysis } from "@/lib/analyze"
import { activeLabel, fullName } from "@/lib/data"

// Built-in PDF fonts only cover Latin-1, so swap typographic characters for plain ones.
const clean = (s: string) =>
  s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/×/g, "x")
    .replace(/[^\x20-\x7E -ÿ]/g, "")

type Rgb = [number, number, number]
const INK: Rgb = [66, 66, 66]
const MUTED: Rgb = [117, 117, 117]
const NAVY: Rgb = [9, 60, 116]
const ROSE: Rgb = [196, 43, 71]
const AMBER: Rgb = [138, 90, 11]
const BLUE: Rgb = [25, 113, 194]

const STATUS_LABEL = { avoid: "CONFLICT", caution: "USE WITH CARE", synergy: "GOOD SYNERGY" } as const
const STATUS_COLOR = { avoid: ROSE, caution: AMBER, synergy: BLUE } as const
const CONCERN = { irritation: "Irritation risk", efficacy: "Reduces effectiveness" } as const

/** Builds the analysis PDF in the browser. jsPDF is imported on demand to keep the page light. */
export async function downloadAnalysisPdf(analysis: Analysis) {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 48
  const width = pageW - margin * 2
  let y = margin

  function text(
    value: string,
    o: { size?: number; bold?: boolean; color?: Rgb; gap?: number; indent?: number } = {},
  ) {
    const size = o.size ?? 11
    const [r, g, b] = o.color ?? INK
    doc.setFont("helvetica", o.bold ? "bold" : "normal")
    doc.setFontSize(size)
    doc.setTextColor(r, g, b)
    const lineH = size * 1.45
    const lines = doc.splitTextToSize(clean(value), width - (o.indent ?? 0)) as string[]
    for (const line of lines) {
      if (y + lineH > pageH - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin + (o.indent ?? 0), y + size)
      y += lineH
    }
    y += o.gap ?? 0
  }

  const heading = (value: string) => text(value, { size: 14, bold: true, color: NAVY, gap: 6 })

  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  text("BuildMySkincare", { size: 12, bold: true, color: ROSE })
  text("Compatibility Analysis", { size: 24, bold: true, color: NAVY })
  text(date, { color: MUTED, gap: 14 })

  const { verdict, counts } = analysis
  text(VERDICT_TITLE[verdict], { size: 16, bold: true, color: verdict === "attention" ? ROSE : verdict === "caution" ? AMBER : INK })
  text(VERDICT_BODY[verdict], { gap: 6 })
  text(`${counts.avoid} conflicts   |   ${counts.caution} cautions   |   ${counts.synergy} synergies   |   ${analysis.steps.length} steps`, {
    color: MUTED,
    gap: 16,
  })

  heading("Your routine")
  analysis.products.forEach((p, i) => {
    const actives = p.actives.map(activeLabel).join(", ") || "no tracked actives"
    text(`${i + 1}. ${fullName(p)}`, { bold: true })
    text(`${p.category}  -  ${actives}`, { color: MUTED, indent: 14, gap: 4 })
  })
  y += 10

  const groups = [
    { title: "What to look at", items: analysis.findings.filter((f) => f.status !== "synergy") },
    { title: "What's working", items: analysis.findings.filter((f) => f.status === "synergy") },
  ]
  for (const group of groups) {
    if (group.items.length === 0) continue
    heading(group.title)
    for (const f of group.items) {
      text(STATUS_LABEL[f.status], { size: 9, bold: true, color: STATUS_COLOR[f.status] })
      text(f.title, { bold: true })
      text(`${f.products[0]} x ${f.products[1]}`, { size: 10, color: MUTED })
      if (f.concerns.length) text(f.concerns.map((c) => CONCERN[c]).join(" / "), { size: 10, color: MUTED })
      text(f.explanation, { gap: f.suggestion ? 2 : 10 })
      if (f.suggestion) text(`Suggestion: ${f.suggestion}`, { gap: 10 })
    }
  }
  if (analysis.findings.length === 0) {
    text("No known interactions between these products.", { gap: 10 })
  }

  heading("Suggested application order")
  analysis.steps.forEach((s, i) => {
    text(`Step ${i + 1}: ${s.name}`, { bold: true })
    if (s.note) text(s.note.text, { size: 10, color: s.note.tone === "ok" ? MUTED : AMBER, indent: 14 })
  })
  y += 8

  if (analysis.skipped.length) {
    text(`Not compared (no tracked actives): ${analysis.skipped.join(", ")}.`, { size: 10, color: MUTED, gap: 8 })
  }
  text(
    "General ingredient guidance, not medical advice. If you have a skin condition or a reaction, check with a dermatologist.",
    { size: 9, color: MUTED },
  )

  doc.save("skincare-compatibility-analysis.pdf")
}
