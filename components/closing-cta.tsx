import { Reveal } from "@/components/reveal"
import { DropMark } from "@/components/drop-mark"

export function ClosingCta() {
  return (
    <section id="join" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-secondary px-8 py-16 text-center md:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(255,255,255,0.55)_0%,transparent_70%)]"
            />
            <div className="relative mx-auto max-w-xl">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose text-primary-foreground">
                <DropMark className="h-5 w-5" />
              </span>
              <h2 className="mt-6 text-balance font-serif text-4xl leading-tight font-semibold tracking-tight text-secondary-foreground md:text-5xl">
                Start with a single drop
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-secondary-foreground/80">
                Build, analyze, and share — free to begin. Your skin&apos;s next
                chapter starts with one honest look at what you&apos;re using.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#build"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-rose px-7 text-sm font-medium text-primary-foreground transition-colors hover:bg-rose/90"
                >
                  Build my routine
                </a>
                <a
                  href="#analyze"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-secondary-foreground/20 bg-card/70 px-7 text-sm font-medium text-secondary-foreground transition-colors hover:bg-card"
                >
                  Analyze my routine
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
