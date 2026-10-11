"use client"

import { useEffect, useRef } from "react"
import { DropMark } from "@/components/drop-mark"

// Keeps the floating drop within a comfortable vertical band of the
// viewport so it never collides with the header or footer.
const TOP_MARGIN = 0.16
const BOTTOM_MARGIN = 0.86

/**
 * A single translucent drop that trails the user's scroll position.
 * No track, no line, no stops — it simply drifts down (and back up)
 * the right edge of the screen as a soft, lagging follower.
 */
export function ScrollDropNav() {
  const dropRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const frameRef = useRef<number | null>(null)
  const reducedRef = useRef(false)

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const computeTarget = () => {
      const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const p = Math.min(Math.max(window.scrollY / total, 0), 1)
      const band = window.innerHeight * (BOTTOM_MARGIN - TOP_MARGIN)
      targetRef.current = window.innerHeight * TOP_MARGIN + p * band
    }

    const tick = () => {
      const diff = targetRef.current - currentRef.current
      currentRef.current += diff * (reducedRef.current ? 1 : 0.08)
      if (dropRef.current) {
        dropRef.current.style.transform = `translate3d(0, ${currentRef.current}px, 0)`
      }
      frameRef.current = requestAnimationFrame(tick)
    }

    computeTarget()
    currentRef.current = targetRef.current
    const onScroll = () => computeTarget()
    const onResize = () => computeTarget()

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    frameRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-5 top-0 z-30 hidden md:right-7 md:block lg:right-9"
    >
      <div ref={dropRef} className="relative -translate-y-1/2 will-change-transform">
        <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose/20 blur-[4px]" />
        <DropMark className="relative h-3.5 w-3.5 text-rose drop-shadow-[0_2px_5px_rgba(242,106,141,0.35)]" />
      </div>
    </div>
  )
}
