import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type TabItem = {
  id: string
  label: string
  icon: React.ReactNode
}

interface TabSwitcherProps {
  tabs: TabItem[]
  activeTab: string
  setActiveTab: (id: string) => void
  variant?: "glass" | "neon" | "gradient" | "cyber" | "default"
}

export function TabSwitcher({ 
  tabs, 
  activeTab, 
  setActiveTab, 
  variant = "default" 
}: TabSwitcherProps) {
  const variantStyles = {
    default: "bg-background border border-border rounded-lg p-1",
    glass: "bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-1",
    neon: "bg-black/80 border border-cyan-400 rounded-lg p-1 shadow-[0_0_15px_rgba(0,255,255,0.3)]",
    gradient: "bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-white/10 rounded-lg p-1 backdrop-blur-md",
    cyber: "bg-black/80 border-2 border-l-4 border-r-4 border-yellow-400 rounded-md p-1 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
  }

  const tabStyles = {
    default: "text-muted-foreground hover:text-foreground",
    glass: "text-white/70 hover:text-white",
    neon: "text-cyan-400/70 hover:text-cyan-400",
    gradient: "text-white/70 hover:text-white",
    cyber: "text-yellow-400/70 hover:text-yellow-400"
  }

  const activeTabStyles = {
    default: "bg-accent text-foreground",
    glass: "bg-white/20 text-white",
    neon: "bg-cyan-400/20 text-cyan-400 border border-cyan-400/50",
    gradient: "bg-white/20 text-white",
    cyber: "bg-yellow-400/20 text-yellow-400 border border-yellow-400/50"
  }

  return (
    <div className={cn("relative flex w-full max-w-2xl mx-auto", variantStyles[variant])}>
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "relative flex items-center justify-center gap-2 flex-1 py-3 px-4 text-sm font-medium rounded-md z-10 transition-all duration-200",
            tabStyles[variant],
            activeTab === tab.id && activeTabStyles[variant]
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {tab.icon}
          <span>{tab.label}</span>
          
          {variant === "cyber" && activeTab === tab.id && (
            <>
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-yellow-400"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-yellow-400"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-yellow-400"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-yellow-400"></div>
            </>
          )}
        </motion.button>
      ))}
      
      <motion.div
        className={cn(
          "absolute inset-0 z-0 rounded-md",
          variant === "neon" ? "bg-cyan-400/10" : 
          variant === "cyber" ? "bg-yellow-400/10" : 
          "bg-white/10"
        )}
        initial={false}
        animate={{
          width: `${100 / tabs.length}%`,
          x: `${tabs.findIndex(tab => tab.id === activeTab) * 100}%`,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ 
          width: `${100 / tabs.length}%`,
        }}
      />
    </div>
  )
}