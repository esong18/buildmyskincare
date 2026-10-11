import { HomeLink } from "@/components/analyzer-context"

const links = ["Privacy Policy", "Terms of Service", "Contact Us", "FAQ"]

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border bg-mint-light/60">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <HomeLink className="font-sans text-xl font-bold tracking-[-0.02em] text-rose">
              BuildMySkincare
            </HomeLink>
            <p className="mt-2 font-body text-sm text-navy">Understand your skin better, quicker, easier.</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {links.map((link) => (
                <li key={link}>
                  <a href="#top" className="text-sm font-medium text-navy transition-colors hover:text-rose">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 max-w-2xl font-body text-xs leading-relaxed text-muted-foreground">
          BuildMySkincare provides general ingredient information and is not medical advice. Talk to a
          dermatologist before changing your routine if you have a skin condition.
        </p>
      </div>
    </footer>
  )
}
