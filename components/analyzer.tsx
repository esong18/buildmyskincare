"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { useAnalyzer } from "@/components/analyzer-context"
import { ManualProductForm } from "@/components/manual-product-form"
import { ProductList } from "@/components/product-list"
import { ProductSearch } from "@/components/product-search"
import { AnalysisResults } from "@/components/analysis-results"
import { analyze, type Analysis } from "@/lib/analyze"
import type { Product } from "@/lib/types"

const MIN_PRODUCTS = 2

export function Analyzer() {
  const { started, startToken } = useAnalyzer()
  const [items, setItems] = useState<Product[]>([])
  const [manualName, setManualName] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null)
  const [result, setResult] = useState<{ analysis: Analysis; signature: string } | null>(null)

  useEffect(() => {
    if (!started) return
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    inputRef.current?.focus({ preventScroll: true })
  }, [started, startToken])

  const selectedIds = useMemo(() => new Set(items.map((p) => p.id)), [items])
  const canAnalyze = items.length >= MIN_PRODUCTS

  const signature = items.map((p) => p.id).join(",")
  const stale = result !== null && result.signature !== signature

  function runAnalysis() {
    setResult({ analysis: analyze(items), signature })
    // Results mount on the next render; move focus there once they exist.
    requestAnimationFrame(() => {
      resultsHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      resultsHeadingRef.current?.focus({ preventScroll: true })
    })
  }

  function add(product: Product) {
    setItems((prev) => (prev.some((p) => p.id === product.id) ? prev : [...prev, product]))
  }

  return (
    <section
      ref={sectionRef}
      id="analyze"
      hidden={!started}
      aria-labelledby="analyze-heading"
      className="scroll-mt-20 bg-background py-16 md:py-20"
    >
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <h2 id="analyze-heading" className="text-center font-sans text-3xl font-bold text-pink md:text-[2.5rem]">
          Analyze Your Products
        </h2>

        <div className="mt-10">
          <ProductSearch selectedIds={selectedIds} onAdd={add} onManual={setManualName} inputRef={inputRef} />
          {manualName !== null && (
            <ManualProductForm
              key={manualName}
              initialName={manualName}
              onAdd={(p) => {
                add(p)
                setManualName(null)
              }}
              onCancel={() => setManualName(null)}
            />
          )}
        </div>

        <ProductList
          items={items}
          onRemove={(id) => setItems((prev) => prev.filter((p) => p.id !== id))}
          onClear={() => setItems([])}
          onReorder={setItems}
        />

        <div className="mt-12 flex flex-col items-center gap-3">
          <button
            type="button"
            disabled={!canAnalyze}
            onClick={runAnalysis}
            aria-describedby="analyze-hint"
            className="inline-flex h-14 items-center gap-3 rounded-full bg-rose px-10 font-sans text-lg font-semibold text-primary-foreground shadow-[0_8px_24px_rgba(196,43,71,0.25)] transition-colors hover:bg-rose/90 disabled:cursor-not-allowed disabled:bg-carbon-100 disabled:text-carbon-300 disabled:shadow-none"
          >
            Analyze Products
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </button>
          <p id="analyze-hint" className="min-h-5 font-body text-sm text-muted-foreground">
            {items.length === 0 && "Add two or more products to analyze."}
            {items.length === 1 && "Add one more product to analyze."}
            {items.length >= MIN_PRODUCTS && "Order is for your reference. It doesn\u2019t change the analysis yet."}
          </p>
        </div>

        {result && <AnalysisResults ref={resultsHeadingRef} analysis={result.analysis} stale={stale} />}
      </div>
    </section>
  )
}
