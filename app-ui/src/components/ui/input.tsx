import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-transparent shadow-sm focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
        glass: "border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder:text-white/60 focus-visible:border-white/40",
        modern: "border-none bg-black/5 dark:bg-white/5 focus-visible:bg-black/10 dark:focus-visible:bg-white/10 shadow-inner",
        neon: "border-2 border-cyan-400 bg-transparent text-cyan-400 placeholder:text-cyan-400/50 shadow-[0_0_10px_rgba(0,255,255,0.3)] focus-visible:shadow-[0_0_15px_rgba(0,255,255,0.5)]",
      },
      inputSize: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-5 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          className={cn(
            inputVariants({ variant, inputSize, className }),
            icon && "pl-10"
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }