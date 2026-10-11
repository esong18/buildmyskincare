"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, ChevronLeft } from "lucide-react"
import { useAnalyzer } from "@/components/analyzer-context"
import { ManualProductForm } from "@/components/manual-product-form"
import { ProductList } from "@/components/product-list"
import { ProductSearch } from "@/components/product-search"
import { ResultsScreen } from "@/components/results-screen"
import { analyze, type Analysis } from "@/lib/analyze"
import type { Product } from "@/lib/types"

const MIN_PRODUCTS = 2

export function Analyzer() {
  const { started, startToken, stop } = useAnalyzer()
  const [items, setItems] = useState<Product[]>([])
  const [manualName, setManualName] = useState<string | null>(null)
  const [result, setResult] = useState<{ analysis: Analysis; signature: string } | null>(null)
  const [view, setView] = useState<"edit" | "results">("edit")
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!started) return
    window.scrollTo({ top: 0 })
    if (view === "edit") inputRef.current?.focus({ preventScroll: true })
  }, [started, startToken, view])

  const selectedIds = useMemo(() => new Set(items.map((p) => p.id)), [items])
  const canAnalyze = items.length >= MIN_PRODUCTS
  const signature = items.map((p) => p.id).join(",")
  const stale = result !== null && result.signature !== signature

  function runAnalysis() {
    if (!canAnalyze) return
    setResult({ analysis: analyze(items), signature })
    setView("results")
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0 })
      resultsHeadingRef.current?.focus({ preventScroll: true })
    })
  }

  function add(product: Product) {
    setItems((prev) => (prev.some((p) => p.id === product.id) ? prev : [...prev, product]))
  }

  const showResults = view === "results" && result !== null

  return (
    <section
      id="analyze"
      hidden={!started}
      aria-labelledby="analyze-heading"
      className="min-h-[calc(100vh-73px)] bg-white pt-[105px]"
    >
      {showResults ? (
        <ResultsScreen
          ref={resultsHeadingRef}
          items={items}
          analysis={result.analysis}
          stale={stale}
          onReorder={setItems}
          onRemove={(id) => setItems((prev) => prev.filter((p) => p.id !== id))}
          onEdit={() => setView("edit")}
          onReanalyze={runAnalysis}
        />
      ) : (
        <div className="mx-auto max-w-3xl px-5 pb-20 md:px-8">
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6a7282] transition-colors hover:text-foreground"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            Back to home
          </button>

          <h2 id="analyze-heading" className="mt-6 text-center font-sans text-3xl font-bold text-pink md:text-[2.5rem]">
            Analyze Your Products
          </h2>

          <div className="mt-8">
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

          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              type="button"
              disabled={!canAnalyze}
              onClick={runAnalysis}
              aria-describedby="analyze-hint"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-[#dd2d4a] px-10 font-sans text-lg font-semibold text-white shadow-[0_8px_24px_rgba(221,45,74,0.25)] transition-colors hover:bg-[#c42b47] disabled:cursor-not-allowed disabled:bg-carbon-100 disabled:text-carbon-300 disabled:shadow-none"
            >
              Analyze Products
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </button>
            <p id="analyze-hint" className="min-h-5 text-center font-body text-sm text-muted-foreground">
              {items.length === 0 && "Add two or more products to analyze."}
              {items.length === 1 && "Add one more product to analyze."}
              {items.length >= MIN_PRODUCTS && "Order is for your reference. It doesn’t change the analysis yet."}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
