import { SiteHeader } from "@/components/site-header"
import { ScrollDropNav } from "@/components/scroll-drop-nav"
import { Hero } from "@/components/hero"
import { Analyzer } from "@/components/analyzer"
import { AnalyzerProvider } from "@/components/analyzer-context"
import { Features } from "@/components/features"
import { AnalyzeShowcase } from "@/components/analyze-showcase"
import { ClosingCta } from "@/components/closing-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <AnalyzerProvider>
      <div className="relative z-[9999]">
        <SiteHeader />
        <ScrollDropNav />
      </div>
      <main className="relative z-0">
        <Hero />
        <Analyzer />
        <Features />
        <AnalyzeShowcase />
        <ClosingCta />
      </main>
      <SiteFooter />
    </AnalyzerProvider>
  )
}
