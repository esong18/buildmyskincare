"use client"

import { useEffect, useState } from "react"
import { DropMark } from "@/components/drop-mark"

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
          ? "border-b border-border bg-[#F6FFF8]/95 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-[#F6FFF8]/90 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="font-sans text-xl font-extrabold tracking-[-0.04em] text-rose md:text-2xl">
            BuildMySkincare
          </span>
        </a>

        <div className="flex items-center gap-2">
          <a
            href="#analyze"
            className="inline-flex h-10 items-center justify-center rounded-full bg-rose px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-rose/90"
          >
            Analyze
          </a>
        </div>
      </div>
    </header>
  )
}
