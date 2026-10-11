"use client"

import { useEffect, useState } from "react"
import { StartLink } from "@/components/analyzer-context"

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9999] transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-mint-light/95 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-mint-light/90 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="font-sans text-xl font-bold tracking-[-0.02em] text-rose md:text-2xl">
            BuildMySkincare
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <StartLink className="border-b-2 border-rose pb-0.5 text-sm font-medium text-navy">
            Build a Routine
          </StartLink>
        </nav>

        <div className="flex items-center gap-2">
          <StartLink
            className="inline-flex h-10 items-center justify-center rounded-full bg-rose px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-rose/90"
          >
            Start Building
          </StartLink>
        </div>
      </div>
    </header>
  )
}
