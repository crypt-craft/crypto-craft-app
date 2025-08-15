export const icons = {
  "logo":  function Logo({ width = 20, height = 20, className }: { width: number, height: number, className?: string }) {
    return (
        //@ts-ignore
      <img 
        src="/logo.png"
        alt="Logo"
        width={width}
        height={height}
        className={className}
      />
    )
  }
}