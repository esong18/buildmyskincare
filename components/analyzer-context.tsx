"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

interface AnalyzerState {
  started: boolean
  /** Increments on every start request so the tool can re-scroll and re-focus. */
  startToken: number
  start: () => void
}

const AnalyzerContext = createContext<AnalyzerState | null>(null)

export function AnalyzerProvider({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false)
  const [startToken, setStartToken] = useState(0)

  const start = useCallback(() => {
    setStarted(true)
    setStartToken((t) => t + 1)
  }, [])

  const value = useMemo(() => ({ started, startToken, start }), [started, startToken, start])
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
