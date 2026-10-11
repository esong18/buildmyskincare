import Image from "next/image"
import { Reveal } from "@/components/reveal"
import { DropMark } from "@/components/drop-mark"

const steps = [
  { n: "01", title: "Add your shelf", body: "Snap or search the products you use today." },
  { n: "02", title: "Read the drop-down", body: "Every ingredient, decoded into plain language." },
  { n: "03", title: "See your score", body: "A single number that tracks your barrier health." },
]

export function AnalyzeShowcase() {
  return (
    <section className="relative bg-accent/60 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card">
            <Image
              src="/routine-flatlay.png"
              alt="Overhead flatlay of a minimal skincare routine with serum bottles and botanical leaves"
              width={720}
              height={720}
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute right-5 top-5 flex items-center gap-3 rounded-2xl border border-border bg-card/90 px-4 py-3 backdrop-blur-sm">
              <span className="font-serif text-2xl font-semibold text-rose">92</span>
              <div className="leading-tight">
                <p className="text-xs font-medium text-foreground">Skin score</p>
                <p className="text-xs text-muted-foreground">Barrier: strong</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="order-1 max-w-lg lg:order-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-rose">
              <DropMark className="h-4 w-4 text-rose" />
              Analyze
            </span>
            <h2 className="mt-4 text-balance font-serif text-4xl leading-tight font-semibold tracking-tight text-foreground md:text-5xl">
              Know what&apos;s really in your routine
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
              No more guessing whether two products cancel each other out. Lumea
              reads the full ingredient list and turns it into guidance you can
              act on tonight.
            </p>
          </Reveal>

          <ol className="mt-10 space-y-6">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 120}>
                <div className="flex gap-4">
                  <span className="font-serif text-lg font-semibold text-rose/80">{step.n}</span>
                  <div>
                    <p className="font-medium text-foreground">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
