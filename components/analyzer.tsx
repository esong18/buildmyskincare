"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowRight, ChevronLeft } from "lucide-react"
import { useAnalyzer } from "@/components/analyzer-context"
import { ManualProductForm } from "@/components/manual-product-form"
import { ProductList } from "@/components/product-list"
import { ProductSearch } from "@/components/product-search"
import { AnalysisResults } from "@/components/analysis-results"
import { analyze, type Analysis } from "@/lib/analyze"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

const MIN_PRODUCTS = 2

export function Analyzer() {
  const { started, startToken, stop } = useAnalyzer()
  const [items, setItems] = useState<Product[]>([])
  const [manualName, setManualName] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null)
  const [result, setResult] = useState<{ analysis: Analysis; signature: string } | null>(null)

  useEffect(() => {
    if (!started) return
    window.scrollTo({ top: 0 })
    inputRef.current?.focus({ preventScroll: true })
  }, [started, startToken])

  const selectedIds = useMemo(() => new Set(items.map((p) => p.id)), [items])
  const canAnalyze = items.length >= MIN_PRODUCTS

  const signature = items.map((p) => p.id).join(",")
  const stale = result !== null && result.signature !== signature

  function runAnalysis() {
    if (!canAnalyze) return
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

  const hasResult = result !== null

  const searchAndList = (
    <>
      <div className={hasResult ? "mt-0" : "mt-8"}>
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
        variant={hasResult ? "routine" : "list"}
        onRemove={(id) => setItems((prev) => prev.filter((p) => p.id !== id))}
        onClear={() => setItems([])}
        onReorder={setItems}
      />

      <div className="mt-10 flex flex-col items-center gap-3">
        {!hasResult && (
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
        )}
        <p id="analyze-hint" className="min-h-5 text-center font-body text-sm text-muted-foreground">
          {items.length === 0 && "Add two or more products to analyze."}
          {items.length === 1 && "Add one more product to analyze."}
          {items.length >= MIN_PRODUCTS && "Order is for your reference. It doesn\u2019t change the analysis yet."}
        </p>
      </div>
    </>
  )

  return (
    <section
      ref={sectionRef}
      id="analyze"
      hidden={!started}
      aria-labelledby="analyze-heading"
      className="min-h-[calc(100vh-4rem)] bg-background pb-20 pt-24 md:pt-28"
    >
      <div className={cn("mx-auto px-5 md:px-8", hasResult ? "max-w-6xl" : "max-w-3xl")}>
        <button
          type="button"
          onClick={stop}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Back to home
        </button>

        <h2
          id="analyze-heading"
          className={cn("mt-6 font-sans text-3xl font-bold text-pink md:text-[2.5rem]", !hasResult && "text-center")}
        >
          {hasResult ? "My Skincare Routines" : "Analyze Your Products"}
        </h2>
        {hasResult && (
          <div className="mt-2 border-b border-border pb-6">
            <p className="flex items-center gap-2 font-body text-base text-muted-foreground">
              <span
                aria-hidden="true"
                className={cn("h-2.5 w-2.5 rounded-full", stale ? "bg-caution-text" : "bg-[#00a63e]")}
              />
              {stale ? "Changes not analyzed yet" : "Last updated just now"}
            </p>
          </div>
        )}

        {/* Same tree in both states so the search input and manual form keep their state. */}
        <div className={cn("grid grid-cols-1 items-start gap-8", hasResult ? "mt-8 lg:grid-cols-[1.05fr_1fr]" : "mt-2")}>
          <div>{searchAndList}</div>
          {hasResult && (
            <div>
              <AnalysisResults
                ref={resultsHeadingRef}
                analysis={result.analysis}
                stale={stale}
                onReanalyze={runAnalysis}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
