import * as React from "react"
import { cn } from "@/app/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "critical" | "warning" | "info" | "success" | "neutral"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80": variant === "default",
          "border-transparent bg-critical text-white hover:bg-critical/80": variant === "critical",
          "border-transparent bg-warning text-white hover:bg-warning/80": variant === "warning",
          "border-transparent bg-info text-white hover:bg-info/80": variant === "info",
          "border-transparent bg-success text-white hover:bg-success/80": variant === "success",
          "border-transparent bg-slate-800 text-white hover:bg-slate-800/80": variant === "neutral",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
