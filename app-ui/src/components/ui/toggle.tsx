import * as React from "react"
import * as TogglePrimitives from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        neon: "data-[state=on]:bg-cyan-400 data-[state=on]:text-black data-[state=on]:shadow-[0_0_15px_rgba(0,255,255,0.5)] border-2 border-cyan-400 text-cyan-400",
        glass: "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 data-[state=on]:bg-white/30",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitives.Root>,
    VariantProps<typeof toggleVariants> {}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitives.Root>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitives.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitives.Root.displayName

export { Toggle, toggleVariants }
