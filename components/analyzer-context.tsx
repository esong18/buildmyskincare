"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

interface AnalyzerState {
  started: boolean
  /** Increments on every start request so the tool can re-scroll and re-focus. */
  startToken: number
  start: () => void
  /** Return to the landing page. The product list is kept. */
  stop: () => void
}

const AnalyzerContext = createContext<AnalyzerState | null>(null)

export function AnalyzerProvider({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false)
  const [startToken, setStartToken] = useState(0)

  const start = useCallback(() => {
    setStarted(true)
    setStartToken((t) => t + 1)
  }, [])

  const stop = useCallback(() => {
    setStarted(false)
    window.scrollTo({ top: 0 })
  }, [])

  const value = useMemo(() => ({ started, startToken, start, stop }), [started, startToken, start, stop])
  return <AnalyzerContext.Provider value={value}>{children}</AnalyzerContext.Provider>
}

export function useAnalyzer() {
  const ctx = useContext(AnalyzerContext)
  if (!ctx) throw new Error("useAnalyzer must be used inside AnalyzerProvider")
  return ctx
}

/** An anchor that reveals the analyzer (PRD step 2) instead of just jumping the page. */
export function StartLink({ className, children }: { className?: string; children: ReactNode }) {
  const { start } = useAnalyzer()
  return (
    <a
      href="#analyze"
      className={className}
      onClick={(e) => {
        e.preventDefault()
        start()
      }}
    >
      {children}
    </a>
  )
}

/** Landing sections only show before the analyzer is opened. */
export function LandingGate({ children }: { children: ReactNode }) {
  const { started } = useAnalyzer()
  return started ? null : <>{children}</>
}

/** Wordmark link: back to the landing page from the analyzer view. */
export function HomeLink({ className, children }: { className?: string; children: ReactNode }) {
  const { stop } = useAnalyzer()
  return (
    <a
      href="#top"
      className={className}
      onClick={(e) => {
        e.preventDefault()
        stop()
      }}
    >
      {children}
    </a>
  )
}
