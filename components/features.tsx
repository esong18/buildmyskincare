import { Reveal } from "@/components/reveal"

const features = [
  {
    id: "build",
    eyebrow: "Build",
    title: "Build a routine",
    body: "Answer a few questions about your skin and goals. Lumea composes a morning-to-night routine with the right actives, in the right order, at the right strength.",
    points: ["Personalized to your skin type", "Conflict-free active pairing", "Adjusts as your skin changes"],
  },
  {
    id: "analyze",
    eyebrow: "Analyze",
    title: "Analyze your current one",
    body: "Add the products you already own. We break down every ingredient, flag redundancies and irritants, and show you exactly what to keep, swap, or space out.",
    points: ["Full ingredient breakdown", "Irritation & conflict alerts", "A clear skin-health score"],
  },
  {
    id: "share",
    eyebrow: "Share",
    title: "Post your routine",
    body: "Publish your ritual for others to discover. Follow people with skin like yours, save the routines you love, and learn what actually works from real results.",
    points: ["Share to a skin-type feed", "Save & remix routines", "Follow real results"],
  },
]

export function Features() {
  return (
    <section id="build" className="relative overflow-hidden bg-background py-36 md:py-48">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="text-center">
          <h2 className="text-balance font-sans text-4xl font-medium leading-tight tracking-[-0.05em] text-foreground md:text-6xl">
            Everything you need to build the perfect routine.
          </h2>
        </Reveal>

        <div className="relative mt-24 grid grid-cols-1 gap-16 md:mt-32 md:grid-cols-3 md:gap-10">
          {features.map((feature, i) => (
            <Reveal key={feature.id} delay={i * 120} className="relative text-center">
              <article id={i === 0 ? undefined : feature.id} className="group relative mx-auto max-w-sm">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose text-2xl font-bold text-primary-foreground transition-transform group-hover:scale-105 md:h-20 md:w-20 md:text-3xl">
                  {i + 1}
                </span>
                <h3 className="relative mt-8 font-sans text-xl font-medium tracking-[-0.04em] text-foreground md:text-2xl">
                  {feature.title === "Build a routine" ? "Select Your Products" : feature.title === "Analyze your current one" ? "Check Compatibility" : "Analyze, Save, or Share"}
                </h3>
                <p className="relative mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {feature.body}
                </p>
                <a href={`#${feature.id}`} className="relative mt-6 inline-flex text-sm font-medium text-rose transition-transform hover:translate-x-1">
                  Learn more <span aria-hidden="true" className="ml-2">&rarr;</span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}
