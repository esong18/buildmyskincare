import { SiteHeader } from "@/components/site-header"
import { ScrollDropNav } from "@/components/scroll-drop-nav"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { AnalyzeShowcase } from "@/components/analyze-showcase"
import { Community } from "@/components/community"
import { ClosingCta } from "@/components/closing-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <>
      <div className="relative z-[9999]">
        <SiteHeader />
        <ScrollDropNav />
      </div>
      <main className="relative z-0">
        <Hero />
        <Features />
        <AnalyzeShowcase />
        <Community />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  )
}
