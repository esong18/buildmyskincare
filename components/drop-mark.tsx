import { cn } from "@/lib/utils"

export function DropMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("h-4 w-4", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2.5C12 2.5 5 10.2 5 15a7 7 0 0 0 14 0c0-4.8-7-12.5-7-12.5Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <path
        d="M9.2 13.4c-.6 1-.9 2-.7 3"
        stroke="#ffffff"
        strokeOpacity="0.7"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
