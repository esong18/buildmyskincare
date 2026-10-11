import { Reveal } from "@/components/reveal"

const features = [
  {
    id: "select",
    title: "Select Your Products",
    body: "Search for the products in your routine and add them to your list in the order you use them.",
  },
  {
    id: "compatibility",
    title: "Check Compatibility",
    body: "Our system checks the active ingredients across your products and flags the ones that work against each other.",
  },
  {
    id: "results",
    title: "Understand the Results",
    body: "See which pairs to separate, which to keep, and why, in plain language you can act on tonight.",
  },
]

export function Features() {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="text-center">
          <h2 className="text-balance font-sans text-3xl font-light leading-tight text-foreground md:text-5xl">
            Everything you need to build the perfect routine.
          </h2>
        </Reveal>

        <div className="relative mt-16 grid grid-cols-1 gap-16 md:mt-24 md:grid-cols-3 md:gap-10">
          {features.map((feature, i) => (
            <Reveal key={feature.id} delay={i * 120} className="relative text-center">
              <article className="group relative mx-auto max-w-sm">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose text-2xl font-bold text-primary-foreground transition-transform group-hover:scale-105 md:h-20 md:w-20 md:text-3xl">
                  {i + 1}
                </span>
                <h3 className="relative mt-8 font-sans text-xl font-normal text-foreground md:text-2xl">
                  {feature.title}
                </h3>
                <p className="relative mt-5 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                  {feature.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}
