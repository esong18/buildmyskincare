import { DropMark } from "@/components/drop-mark"

const columns = [
  { title: "Product", links: ["Build a routine", "Analyze products", "Community feed", "Ingredient index"] },
  { title: "Company", links: ["About", "Journal", "Careers", "Press"] },
  { title: "Support", links: ["Help center", "Contact", "Privacy", "Terms"] },
]

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <a href="#top" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose text-primary-foreground">
                <DropMark className="h-4 w-4" />
              </span>
              <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
                Lumea
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Skincare, decoded drop by drop. Build, analyze, and share routines
              that actually fit your skin.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Lumea. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Made for healthy skin, not hype.</p>
        </div>
      </div>
    </footer>
  )
}
