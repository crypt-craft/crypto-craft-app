import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-transparent shadow-sm focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
        glass: "border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder:text-white/60 focus-visible:border-white/40",
        modern: "border-none bg-black/5 dark:bg-white/5 focus-visible:bg-black/10 dark:focus-visible:bg-white/10 shadow-inner",
        neon: "border-2 border-cyan-400 bg-transparent text-cyan-400 placeholder:text-cyan-400/50 shadow-[0_0_10px_rgba(0,255,255,0.3)] focus-visible:shadow-[0_0_15px_rgba(0,255,255,0.5)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
