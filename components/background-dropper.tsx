"use client"

import { useEffect, useRef } from "react"

/**
 * A large, faded pipette silhouette that lives in the page background.
 * It is fully transparent to interaction and drifts only a few pixels
 * with scroll — an ambient watermark, not the focal interaction.
 */
export function BackgroundDropper() {
  const ref = useRef<HTMLDivElement>(null)
  const ticking = useRef(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const el = ref.current
        if (el) {
          const y = window.scrollY
          el.style.transform = `translate3d(0, ${Math.min(y * 0.04, 60)}px, 0) rotate(4deg)`
        }
        ticking.current = false
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        ref={ref}
        className="absolute -right-[8vw] -top-[18vh] h-[88vh] w-[72vw] max-w-[760px] will-change-transform md:-right-[3vw] md:h-[110vh] md:w-[48vw]"
        style={{ transform: "rotate(4deg)" }}
      >
        <svg
          viewBox="0 0 320 760"
          fill="none"
          className="h-full w-full text-rose opacity-[0.22]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M80 0H260L170 188L140 242L92 208L118 148L80 0Z" fill="currentColor" />
          <path d="M118 148L170 188L140 242L92 208Z" fill="currentColor" opacity="0.7" />
          <path d="M140 242L128 350L116 430L103 507L88 565L74 520L83 436L92 350L92 208Z" fill="currentColor" opacity="0.74" />
          <path d="M72 565L88 565L80 642L74 680L68 642L72 565Z" fill="currentColor" opacity="0.78" />
          <path d="M77 675C94 687 92 709 80 725C68 709 66 687 77 675Z" fill="currentColor" opacity="0.66" />
          <path d="M91 565L103 507L116 430L124 352L135 357L128 438L116 514L101 570Z" fill="currentColor" opacity="0.23" />
        </svg>
      </div>
    </div>
  )
}
