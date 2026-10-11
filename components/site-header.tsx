"use client"

import { HomeLink, StartLink } from "@/components/analyzer-context"

/** Nav items that have no page in V1. They render as in the design but don't navigate. */
function InertLink({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <a href="#top" onClick={(e) => e.preventDefault()} className={className}>
      {children}
    </a>
  )
}

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[9999] h-[73px] border-b border-[#e5e7eb] bg-[#f6fff8]">
      <div className="flex h-full items-center justify-between px-5 sm:px-8">
        <HomeLink className="font-sans text-2xl font-bold leading-8 tracking-[-0.6px] text-[#df3b57]">
          BuildMySkincare
        </HomeLink>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <StartLink className="border-b-2 border-[#dd2d4a] pb-1.5 text-sm font-medium leading-5 text-[#093c74]">
            Build a Routine
          </StartLink>
          <InertLink className="text-sm font-medium leading-5 text-[#093c74]">Community Routines</InertLink>
          <InertLink className="text-sm font-medium leading-5 text-[#093c74]">About</InertLink>
        </nav>

        <div className="flex items-center gap-4">
          <InertLink className="hidden text-sm font-bold leading-5 text-[#093c74] sm:inline">Log In</InertLink>
          <StartLink className="inline-flex h-10 items-center rounded-full bg-[#dd2d4a] px-5 text-sm font-medium text-white shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#c42b47]">
            Start Building
          </StartLink>
        </div>
      </div>
    </header>
  )
}
