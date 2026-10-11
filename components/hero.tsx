export function Hero() {
  return (
    <section id="top" className="relative min-h-[760px] overflow-hidden bg-rose-soft/50 pt-32 pb-28 md:min-h-[790px] md:pt-40 md:pb-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-background [clip-path:ellipse(70%_62%_at_50%_100%)] md:h-72" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        <div className="max-w-[820px]">
          <h1 className="max-w-3xl text-balance font-sans text-5xl font-medium leading-[1.12] tracking-[-0.055em] text-foreground md:text-[4.25rem]">
            Build, analyze, and share
            <br />
            all in one place.
          </h1>

          <div className="mt-24 max-w-xl md:mt-32">
            <p className="text-pretty font-sans text-xl leading-[1.35] tracking-[-0.03em] text-foreground md:text-3xl">
              AI powered analysis of skincare ingredients
              <br className="hidden md:block" />
              and compatibility to get you to your goals.
            </p>
            <a
              href="#build"
              className="mt-8 inline-flex h-14 items-center justify-center rounded-xl bg-rose px-7 text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-rose/90"
            >
              Start analyzing my routine
            </a>
          </div>
        </div>
      </div>

    </section>
  )
}
