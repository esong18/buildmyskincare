import { HomeLink } from "@/components/analyzer-context"

const links = ["Privacy Policy", "Terms of Service", "Contact Us", "FAQ"]

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-[#e5e7eb] bg-[#f6fff8]">
      <div className="flex flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <HomeLink className="font-sans text-xl font-bold leading-7 tracking-[-0.5px] text-[#df3b57]">
            BuildMySkincare
          </HomeLink>
          <p className="text-sm leading-5 text-[#093c74] opacity-80">Understand your skin better, quicker, easier.</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <li key={link}>
                <a href="#top" className="text-sm font-medium leading-5 text-[#093c74]">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
