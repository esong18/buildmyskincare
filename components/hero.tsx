export function Hero() {
  return (
    <section id="top" className="relative min-h-[680px] overflow-hidden bg-rose-soft/50 pt-32 pb-28 md:min-h-[760px] md:pt-44 md:pb-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-background [clip-path:ellipse(70%_62%_at_50%_100%)] md:h-72" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-10">
        <div className="max-w-[820px]">
          <h1 className="max-w-3xl text-balance font-sans text-4xl font-light leading-[1.15] tracking-[-0.02em] text-foreground md:text-[2.5rem] md:leading-[1.15]">
            Build your most compatible skincare routine.
          </h1>

          <div className="mt-16 max-w-xl md:mt-24">
            <p className="text-pretty font-sans text-lg font-light leading-[1.4] text-foreground md:text-2xl">
              AI powered analysis of skincare ingredients in your routine to help get you to your goals
            </p>
            <a
              href="#analyze"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-rose px-6 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-rose/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-dark"
            >
              Start analyzing my routine
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
