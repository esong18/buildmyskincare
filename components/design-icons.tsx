/* Icons exported from the Figma results screen (public/figma). */
import { cn } from "@/lib/utils"

function Piece({ src, outer, inner }: { src: string; outer: string; inner: string }) {
  return (
    <div className={cn("absolute", outer)}>
      <div className={cn("absolute", inner)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="block size-full max-w-none" src={src} />
      </div>
    </div>
  )
}

/** The sun is eight separate vectors in the design; positions are copied from it. */
export function SunIcon() {
  return (
    <div aria-hidden="true" className="relative h-5 w-full overflow-clip">
      <Piece src="/figma/sun-circle.svg" outer="inset-[33.33%]" inner="inset-[-12.5%]" />
      <Piece src="/figma/sun-ray-v.svg" outer="bottom-[83.33%] left-1/2 right-1/2 top-[8.33%]" inner="inset-[-50%_-0.83px]" />
      <Piece src="/figma/sun-ray-v.svg" outer="bottom-[8.33%] left-1/2 right-1/2 top-[83.33%]" inner="inset-[-50%_-0.83px]" />
      <Piece src="/figma/sun-diag-tl.svg" outer="inset-[20.54%_73.58%_73.58%_20.54%]" inner="inset-[-70.92%]" />
      <Piece src="/figma/sun-diag-br.svg" outer="inset-[73.58%_20.54%_20.54%_73.58%]" inner="inset-[-70.92%]" />
      <Piece src="/figma/sun-ray-h.svg" outer="bottom-1/2 left-[8.33%] right-[83.33%] top-1/2" inner="inset-[-0.83px_-50%]" />
      <Piece src="/figma/sun-ray-h.svg" outer="bottom-1/2 left-[83.33%] right-[8.33%] top-1/2" inner="inset-[-0.83px_-50%]" />
      <Piece src="/figma/sun-diag-bl.svg" outer="inset-[73.58%_73.58%_20.54%_20.54%]" inner="inset-[-70.92%]" />
      <Piece src="/figma/sun-diag-tr.svg" outer="inset-[20.54%_20.54%_73.58%_73.58%]" inner="inset-[-70.92%]" />
    </div>
  )
}

export function DesignIcon({
  name,
  className,
}: {
  name: "edit" | "sparkles" | "conflict" | "synergy" | "info" | "back"
  className?: string
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt="" aria-hidden="true" src={`/figma/icon-${name}.svg`} className={cn("block max-w-none", className)} />
}
