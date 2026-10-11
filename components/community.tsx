import Image from "next/image"
import { Reveal } from "@/components/reveal"
import { DropMark } from "@/components/drop-mark"

const routines = [
  { name: "Maya R.", type: "Combination · 28", steps: 6, saves: "1.2k", note: "Barrier-first PM ritual" },
  { name: "Jonah T.", type: "Oily · 34", steps: 4, saves: "860", note: "Minimalist glass-skin AM" },
  { name: "Priya S.", type: "Dry · 41", steps: 7, saves: "2.4k", note: "Retinol night, done gently" },
]

export function Community() {
  return (
    <section id="community" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-rose">
              <DropMark className="h-4 w-4 text-rose" />
              Community
            </span>
            <h2 className="mt-4 text-balance font-serif text-4xl leading-tight font-semibold tracking-tight text-foreground md:text-5xl">
              Post your routine, find your skin twin
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-md text-pretty leading-relaxed text-muted-foreground lg:ml-auto">
              Share the routine that finally worked and discover others on the
              same journey. Filtered by skin type, so the advice actually
              applies to you.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
          <Reveal className="h-full">
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-[2rem] border border-border bg-card">
              <Image
                src="/community-skin.png"
                alt="Close-up portrait of a person with healthy, glowing skin"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-border bg-card/85 px-5 py-4 backdrop-blur-sm">
                <p className="text-sm font-medium text-foreground">&ldquo;Three months in and my barrier finally calmed down.&rdquo;</p>
                <p className="mt-1 text-xs text-muted-foreground">Lena · Sensitive skin</p>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {routines.map((r, i) => (
              <Reveal key={r.name} delay={i * 100} className="h-full">
                <article className="flex h-full flex-col justify-between rounded-[1.5rem] border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:border-rose/50">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/45 font-serif text-sm font-semibold text-foreground">
                      {r.name.charAt(0)}
                    </span>
                    <div className="leading-tight">
                      <p className="text-sm font-medium text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.type}</p>
                    </div>
                  </div>
                  <p className="mt-5 font-serif text-lg text-foreground">{r.note}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{r.steps} steps</span>
                    <span className="inline-flex items-center gap-1.5 text-rose">
                      <DropMark className="h-3.5 w-3.5 text-rose" />
                      {r.saves} saves
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
            <Reveal delay={300} className="h-full sm:col-span-2">
              <a
                href="#build"
                className="flex h-full items-center justify-between rounded-[1.5rem] border border-dashed border-border bg-transparent p-6 transition-colors hover:border-rose hover:bg-card"
              >
                <span className="font-medium text-foreground">Share your own routine</span>
                <span aria-hidden="true" className="text-rose">&rarr;</span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
